import "server-only";

import { createHash, createHmac, randomBytes, randomInt } from "node:crypto";
import { cookies } from "next/headers";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";
import Session from "@/models/Session";

const SESSION_COOKIE = "sk_session";
const SESSION_DAYS = 7;
// Share the authenticated session between www and the dedicated OAuth host.
const COOKIE_DOMAIN = ".skstationaryjansevakendr.com";
const sharedCookieOptions = process.env.NODE_ENV === "production"
  ? { domain: COOKIE_DOMAIN }
  : {};

function authSecret() {
  const secret = process.env.AUTH_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("AUTH_SECRET must be configured with at least 32 characters");
  }
  return secret;
}

export function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

export function hashOtp(email: string, purpose: string, code: string) {
  return createHmac("sha256", authSecret()).update(`${email}:${purpose}:${code}`).digest("hex");
}

export function createOtp() {
  return randomInt(100000, 1000000).toString();
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createUserSession(userId: string) {
  await connectToDatabase();
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000);
  await Session.create({ userId, tokenHash: hashToken(token), expiresAt });
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    expires: expiresAt,
  });
}

export async function getAuthenticatedUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  await connectToDatabase();
  const session = await Session.findOne({
    tokenHash: hashToken(token),
    expiresAt: { $gt: new Date() },
  }).lean();
  if (!session) return null;
  return User.findById(session.userId).select("-__v").lean();
}

export async function destroyUserSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) {
    await connectToDatabase();
    await Session.deleteOne({ tokenHash: hashToken(token) });
  }
  cookieStore.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}
