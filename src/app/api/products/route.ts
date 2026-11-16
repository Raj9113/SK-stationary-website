import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Product from "@/models/Product";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await connectToDatabase();
    const products = await Product.find({ status: "Active" })
      .sort({ featured: -1, createdAt: -1 })
      .select("name sku category price compareAt stock description image featured")
      .lean();

    return NextResponse.json({ ok: true, products });
  } catch (error) {
    console.error("Product listing failed:", error);
    return NextResponse.json(
      { ok: false, message: "Unable to load products right now." },
      { status: 503 }
    );
  }
}
