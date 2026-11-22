import { NextResponse } from "next/server";
import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";

export const runtime = "nodejs";

const APP_BASE_URL = "https://www.skstationaryjansevakendr.com";
const GOOGLE_CALLBACK_URL = "https://auth.skstationaryjansevakendr.com/api/auth/google/callback";
const COOKIE_DOMAIN = ".skstationaryjansevakendr.com";

export async function GET() {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId) return NextResponse.redirect(new URL("/account/login?google=not-configured", APP_BASE_URL));
  const state = randomBytes(24).toString("hex");
  const store = await cookies();
  store.set("google_oauth_state", state, {
    httpOnly: true,
    secure: true,
    sameSite: "lax",
    path: "/",
    domain: COOKIE_DOMAIN,
    maxAge: 600,
  });
  const url = new URL("https://accounts.google.com/o/oauth2/v2/auth");
  url.searchParams.set("client_id", clientId);
  url.searchParams.set("redirect_uri", GOOGLE_CALLBACK_URL);
  url.searchParams.set("response_type", "code");
  url.searchParams.set("scope", "openid email profile");
  url.searchParams.set("state", state);
  url.searchParams.set("prompt", "select_account");
  return NextResponse.redirect(url);
}
