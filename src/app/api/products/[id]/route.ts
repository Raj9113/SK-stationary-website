import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectToDatabase } from "@/lib/mongodb";
import { getAdminAccess } from "@/lib/admin-auth";
import Product from "@/models/Product";
import { POST as createProduct } from "../route";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type Context = { params: Promise<{ id: string }> };

function authFailure(reason: "unauthenticated" | "forbidden") {
  return NextResponse.json(
    { ok: false, message: reason === "unauthenticated" ? "Please log in." : "Administrator access required." },
    { status: reason === "unauthenticated" ? 401 : 403 }
  );
}

export async function PATCH(request: Request, context: Context) {
  try {
    const access = await getAdminAccess();
    if (!access.authorized) return authFailure(access.reason);

    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ ok: false, message: "Invalid product ID." }, { status: 400 });

    let body: Record<string, unknown>;
    try { body = await request.json() as Record<string, unknown>; }
    catch { return NextResponse.json({ ok: false, message: "Invalid JSON request." }, { status: 400 }); }

    await connectToDatabase();
    const existing = await Product.findById(id);
    if (!existing) return NextResponse.json({ ok: false, message: "Product not found." }, { status: 404 });

    const merged = {
      name: body.name ?? existing.name,
      sku: body.sku ?? existing.sku,
      category: body.category ?? existing.category,
      price: body.price ?? existing.price,
      compareAt: body.compareAt ?? existing.compareAt,
      stock: body.stock ?? existing.stock,
      description: body.description ?? existing.description,
      image: body.image ?? existing.image,
      imagePublicId: body.imagePublicId ?? existing.imagePublicId,
      status: body.status ?? existing.status,
      featured: body.featured ?? existing.featured,
    };

    const { normalizeProduct } = await import("@/lib/product-validation");
    const normalized = normalizeProduct(merged);
    if ("error" in normalized) return NextResponse.json({ ok: false, message: normalized.error }, { status: 400 });

    Object.assign(existing, normalized.value);
    await existing.save();
    return NextResponse.json({ ok: true, product: existing });
  } catch (error) {
    if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
      return NextResponse.json({ ok: false, message: "That SKU is already in use. Choose a unique SKU." }, { status: 409 });
    }
    console.error("Product update failed:", error);
    return NextResponse.json({ ok: false, message: "Unable to update product." }, { status: 503 });
  }
}

export async function DELETE(_request: Request, context: Context) {
  try {
    const access = await getAdminAccess();
    if (!access.authorized) return authFailure(access.reason);

    const { id } = await context.params;
    if (!mongoose.isValidObjectId(id)) return NextResponse.json({ ok: false, message: "Invalid product ID." }, { status: 400 });

    await connectToDatabase();
    const product = await Product.findByIdAndDelete(id);
    if (!product) return NextResponse.json({ ok: false, message: "Product not found." }, { status: 404 });
    return NextResponse.json({ ok: true, message: "Product deleted." });
  } catch (error) {
    console.error("Product deletion failed:", error);
    return NextResponse.json({ ok: false, message: "Unable to delete product." }, { status: 503 });
  }
}
