import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type CheckoutLineInput = { id?: unknown; quantity?: unknown };

function cleanText(value: unknown, maxLength: number) {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

function invalid(message: string, status = 400) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return invalid("Please log in to validate checkout.", 401);

    let body: Record<string, unknown>;
    try {
      body = await request.json() as Record<string, unknown>;
    } catch {
      return invalid("Invalid checkout request.");
    }
    if (!body || typeof body !== "object" || Array.isArray(body)) return invalid("Invalid checkout request.");

    const customer = body.customer as Record<string, unknown> | null;
    const email = cleanText(customer?.email, 254).toLowerCase();
    const name = cleanText(customer?.name, 100);
    const mobile = cleanText(customer?.mobile, 20);
    const mobileDigits = mobile.replace(/\D/g, "");
    if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !/^[+\d()\s.-]{7,20}$/.test(mobile) || mobileDigits.length < 7 || mobileDigits.length > 15) {
      return invalid("Enter a valid name, email address and contact number.");
    }

    const paymentMethod = body.paymentMethod;
    if (paymentMethod !== "cod" && paymentMethod !== "razorpay") {
      return invalid("Choose a valid payment method.");
    }
    const notes = cleanText(body.notes, 300);

    const addressInput = body.address as Record<string, unknown> | null;
    if (!addressInput || typeof addressInput !== "object") {
      return invalid("Choose a delivery address or enter a new one.");
    }

    let address: {
      label: string; line1: string; line2: string; locality: string;
      city: string; state: string; postalCode: string; country: string;
    };
    if (typeof addressInput.id === "string") {
      const savedAddress = (user.addresses || []).find((entry: { _id?: unknown }) => String(entry._id || "") === addressInput.id);
      if (!savedAddress) return invalid("That saved address is no longer available. Choose another address.", 409);
      address = {
        label: cleanText(savedAddress.label, 40), line1: cleanText(savedAddress.line1, 160),
        line2: cleanText(savedAddress.line2, 160), locality: cleanText(savedAddress.locality, 100),
        city: cleanText(savedAddress.city, 80), state: cleanText(savedAddress.state, 80),
        postalCode: cleanText(savedAddress.postalCode, 12), country: cleanText(savedAddress.country || "India", 80),
      };
    } else {
      address = {
        label: cleanText(addressInput.label || "Other", 40),
        line1: cleanText(addressInput.line1, 160), line2: cleanText(addressInput.line2, 160),
        locality: cleanText(addressInput.locality, 100), city: cleanText(addressInput.city, 80),
        state: cleanText(addressInput.state, 80), postalCode: cleanText(addressInput.postalCode, 12),
        country: cleanText(addressInput.country || "India", 80),
      };
    }
    if (!address.line1 || !address.city || !address.state || !/^[0-9]{6}$/.test(address.postalCode) || !address.country) {
      return invalid("Enter address line, city, state and a valid 6-digit PIN code.");
    }

    const lines = body.items;
    if (!Array.isArray(lines) || lines.length < 1 || lines.length > 50) {
      return invalid("Your cart must contain between 1 and 50 different products.");
    }

    const quantities = new Map<string, number>();
    for (const rawLine of lines as CheckoutLineInput[]) {
      const id = typeof rawLine?.id === "string" ? rawLine.id.toLowerCase() : "";
      const quantity = rawLine?.quantity;
      if (!mongoose.Types.ObjectId.isValid(id) || !Number.isInteger(quantity) || Number(quantity) < 1 || Number(quantity) > 999) {
        return invalid("Your cart contains an invalid product or quantity.");
      }
      if (quantities.has(id)) return invalid("Your cart contains a duplicate product.");
      quantities.set(id, Number(quantity));
    }

    await connectToDatabase();
    const products = await Product.find({ _id: { $in: [...quantities.keys()] }, status: "Active" })
      .select("name sku price stock status")
      .lean();
    const productById = new Map(products.map((product) => [String(product._id), product]));
    const unavailable = [...quantities.entries()].flatMap(([id, quantity]) => {
      const product = productById.get(id);
      if (!product) return [{ id, message: "This product is no longer available." }];
      if (!Number.isInteger(product.stock) || product.stock < quantity) {
        return [{ id, name: product.name, available: Math.max(0, Number(product.stock) || 0), requested: quantity, message: "There is not enough stock for this quantity." }];
      }
      return [];
    });
    if (unavailable.length) {
      return NextResponse.json({ ok: false, message: "Please update your cart before continuing.", unavailable }, { status: 409 });
    }

    const items = [...quantities.entries()].map(([id, quantity]) => {
      const product = productById.get(id)!;
      const unitAmount = Math.round(Number(product.price) * 100);
      return {
        id, name: product.name, sku: product.sku, quantity,
        unitAmount, lineAmount: unitAmount * quantity,
        availableStock: product.stock,
      };
    });
    if (items.some(item => !Number.isSafeInteger(item.unitAmount) || item.unitAmount < 0 || !Number.isSafeInteger(item.lineAmount))) {
      return invalid("A product price is invalid. Please contact the store.", 503);
    }
    const subtotalAmount = items.reduce((sum, item) => sum + item.lineAmount, 0);
    if (!Number.isSafeInteger(subtotalAmount)) return invalid("The cart total is too large to process.");

    return NextResponse.json({
      ok: true,
      quote: {
        customer: { name, email, mobile }, address, paymentMethod, notes, items,
        currency: "INR", subtotalAmount, deliveryAmount: null, totalAmount: subtotalAmount,
        validatedAt: new Date().toISOString(),
      },
    });
  } catch (error) {
    console.error("Checkout validation failed:", error);
    return NextResponse.json({ ok: false, message: "Unable to validate checkout right now." }, { status: 503 });
  }
}
