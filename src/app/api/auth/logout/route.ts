import { NextResponse } from "next/server";
import { destroyUserSession } from "@/lib/auth";

export const runtime = "nodejs";

export async function POST() {
  try {
    await destroyUserSession();
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Unable to sign out." }, { status: 500 });
  }
}
