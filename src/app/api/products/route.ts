import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAdminAccess } from "@/lib/admin-auth";
import { normalizeProduct, type ProductInput } from "@/lib/product-validation";
import Product from "@/models/Product";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function databaseError(error: unknown) {
  if (typeof error === "object" && error !== null && "code" in error && error.code === 11000) {
    return NextResponse.json({ ok: false, message: "That SKU is already in use. Choose a unique SKU." }, { status: 409 });
  }
  if (typeof error === "object" && error !== null && "name" in error && error.name === "ValidationError") {
    return NextResponse.json({ ok: false, message: "Product details failed validation." }, { status: 400 });
  }
  console.error("Product API failed:", error);
  return NextResponse.json({ ok: false, message: "Unable to complete the product request." }, { status: 503 });
}

export async function GET() {
  try {
    const access = await getAdminAccess();
    await connectToDatabase();
    const filter = access.authorized ? {} : { status: "Active" as const };
    const products = await Product.find(filter)
      .sort({ featured: -1, createdAt: -1 })
      .select("name sku category price compareAt stock description image imagePublicId status featured createdAt updatedAt")
      .lean();
    return NextResponse.json({ ok: true, products });
  } catch (error) {
    return databaseError(error);
  }
}

export async function POST(request: Request) {
  try {
    const access = await getAdminAccess();
    if (!access.authorized) {
      return NextResponse.json(
        { ok: false, message: access.reason === "unauthenticated" ? "Please log in." : "Administrator access required." },
        { status: access.reason === "unauthenticated" ? 401 : 403 }
      );
    }

    let body: ProductInput;
    try { body = await request.json() as ProductInput; }
    catch { return NextResponse.json({ ok: false, message: "Invalid JSON request." }, { status: 400 }); }

    const normalized = normalizeProduct(body);
    if ("error" in normalized) return NextResponse.json({ ok: false, message: normalized.error }, { status: 400 });

    await connectToDatabase();
    const product = await Product.create(normalized.value);
    return NextResponse.json({ ok: true, product }, { status: 201 });
  } catch (error) {
    return databaseError(error);
  }
}
