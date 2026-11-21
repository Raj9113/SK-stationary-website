import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAdminAccess } from "@/lib/admin-auth";
import Product, { PRODUCT_CATEGORIES } from "@/models/Product";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProductInput = {
  name?: unknown;
  sku?: unknown;
  category?: unknown;
  price?: unknown;
  compareAt?: unknown;
  stock?: unknown;
  description?: unknown;
  image?: unknown;
  imagePublicId?: unknown;
  status?: unknown;
  featured?: unknown;
};

function normalizeProduct(body: ProductInput) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const sku = typeof body.sku === "string" ? body.sku.trim().toUpperCase() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const price = Number(body.price);
  const compareAt = body.compareAt === undefined || body.compareAt === null || body.compareAt === "" ? 0 : Number(body.compareAt);
  const stock = body.stock === undefined || body.stock === null || body.stock === "" ? 0 : Number(body.stock);
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const image = typeof body.image === "string" ? body.image.trim() : "";
  const imagePublicId = typeof body.imagePublicId === "string" ? body.imagePublicId.trim() : "";
  const status = body.status === "Active" ? "Active" : body.status === "Draft" || body.status === undefined ? "Draft" : null;
  const featured = body.featured === true;

  if (name.length < 2 || name.length > 160) return { error: "Product name must be between 2 and 160 characters." } as const;
  if (!/^[A-Z0-9][A-Z0-9._-]{0,63}$/.test(sku)) return { error: "Enter a valid SKU using letters, numbers, dots, underscores or hyphens." } as const;
  if (!(PRODUCT_CATEGORIES as readonly string[]).includes(category)) return { error: "Choose a valid product category." } as const;
  if (!Number.isFinite(price) || price < 0) return { error: "Enter a valid selling price." } as const;
  if (!Number.isFinite(compareAt) || compareAt < 0 || (compareAt > 0 && compareAt < price)) return { error: "MRP must be greater than or equal to the selling price." } as const;
  if (!Number.isInteger(stock) || stock < 0) return { error: "Stock must be a whole number greater than or equal to zero." } as const;
  if (description.length > 3000) return { error: "Description cannot exceed 3,000 characters." } as const;
  if (image && (!image.startsWith("https://res.cloudinary.com/") || image.length > 2048)) return { error: "Product image must be a valid Cloudinary HTTPS URL." } as const;
  if (imagePublicId.length > 255) return { error: "Invalid image reference." } as const;
  if (!status) return { error: "Choose Active or Draft status." } as const;

  return { value: { name, sku, category, price, compareAt, stock, description, image, imagePublicId, status, featured } } as const;
}

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
      return NextResponse.json({ ok: false, message: access.reason === "unauthenticated" ? "Please log in." : "Administrator access required." }, { status: access.reason === "unauthenticated" ? 401 : 403 });
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
