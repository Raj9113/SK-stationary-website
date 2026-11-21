import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import { createUserSession, normalizeEmail } from "@/lib/auth";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
  const fail = (reason: string) => NextResponse.redirect(new URL("/account/login?google=" + reason, baseUrl));
  try {
    const url = new URL(request.url);
    const code = url.searchParams.get("code");
    const state = url.searchParams.get("state");
    const store = await cookies();
    const expected = store.get("google_oauth_state")?.value;
    store.delete("google_oauth_state");
    if (!code || !state || !expected || state !== expected) return fail("invalid-state");
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    if (!clientId || !clientSecret) return fail("not-configured");
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST", headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ code, client_id: clientId, client_secret: clientSecret, redirect_uri: baseUrl + "/api/auth/google/callback", grant_type: "authorization_code" }),
      cache: "no-store",
    });
    if (!tokenResponse.ok) return fail("token-failed");
    const tokens = await tokenResponse.json() as { access_token?: string };
    if (!tokens.access_token) return fail("token-failed");
    const infoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", { headers: { Authorization: "Bearer " + tokens.access_token }, cache: "no-store" });
    if (!infoResponse.ok) return fail("profile-failed");
    const info = await infoResponse.json() as { email?: string; verified_email?: boolean; name?: string; picture?: string };
    if (!info.email || info.verified_email !== true) return fail("unverified-email");
    await connectToDatabase();
    const email = normalizeEmail(info.email);
    const user = await User.findOne({ email });
    if (!user) return fail("account-not-found");
    if (info.picture && /^https:\/\//.test(info.picture)) user.avatarUrl = info.picture.slice(0, 2048);
    if (!user.name && info.name) user.name = info.name.slice(0, 100);
    await user.save();
    await createUserSession(String(user._id));
    return NextResponse.redirect(new URL("/account/profile", baseUrl));
  } catch (error) {
    console.error("Google sign-in failed:", error);
    return fail("failed");
  }
}
