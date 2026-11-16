import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const mongoose = await connectToDatabase();
    await mongoose.connection.db?.admin().ping();

    return NextResponse.json({
      ok: true,
      database: "connected",
      message: "MongoDB connection and ping succeeded.",
    });
  } catch (error) {
    console.error("MongoDB health check failed:", error);
    return NextResponse.json(
      {
        ok: false,
        database: "disconnected",
        message: "MongoDB connection failed. Check Vercel environment variables and Atlas network access.",
      },
      { status: 503 }
    );
  }
}
