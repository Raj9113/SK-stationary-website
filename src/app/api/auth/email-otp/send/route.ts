import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { createOtp, hashOtp, normalizeEmail, getAuthenticatedUser } from "@/lib/auth";
import OtpChallenge, { type OtpPurpose } from "@/models/OtpChallenge";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

function escapeHtml(value: string) {
  return value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char] as string);
}

async function sendEmail(to: string, code: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;
  if (!apiKey || !from) throw new Error("Email service is not configured");

  const html = `<div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:28px;color:#20191a"><h2 style="color:#760314">S K Stationary</h2><p>Your email verification code is:</p><div style="font-size:32px;font-weight:700;letter-spacing:8px;padding:18px 0">${code}</div><p>This code expires in 5 minutes. Do not share it with anyone.</p><p style="color:#71686a;font-size:13px">If you did not request this code, you can safely ignore this email.</p></div>`;
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      subject: "Your S K Stationary verification code",
      html,
      text: `Your S K Stationary verification code is ${code}. It expires in 5 minutes. Do not share this code with anyone.`,
    }),
    signal: AbortSignal.timeout(10000),
  });
  if (!response.ok) {
    const detail = await response.text();
    console.error("Resend email request failed:", response.status, detail.slice(0, 500));
    throw new Error("Unable to send verification email");
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
    const purpose = body.purpose as OtpPurpose;
    if (!EMAIL_RE.test(email) || email.length > 254 ||
        !["register", "login", "change-email"].includes(purpose)) {
      return NextResponse.json({ error: "Enter a valid email address and request type." }, { status: 400 });
    }

    await connectToDatabase();
    let userId: string | undefined;
    let pendingProfile: Record<string, unknown> | undefined;

    if (purpose === "register") {
      if (await User.exists({ email })) {
        return NextResponse.json({ error: "An account with this email already exists. Please log in." }, { status: 409 });
      }
      const profile = body.profile;
      if (!profile || typeof profile.name !== "string" || !profile.name.trim() ||
          typeof profile.dateOfBirth !== "string" || Number.isNaN(Date.parse(profile.dateOfBirth))) {
        return NextResponse.json({ error: "Name and date of birth are required." }, { status: 400 });
      }
      const dob = new Date(profile.dateOfBirth);
      const age = (Date.now() - dob.getTime()) / (365.2425 * 24 * 60 * 60 * 1000);
      if (dob >= new Date() || age > 120) {
        return NextResponse.json({ error: "Enter a valid date of birth." }, { status: 400 });
      }
      pendingProfile = {
        name: profile.name.trim().slice(0, 100),
        dateOfBirth: dob,
        mobile: typeof profile.mobile === "string" ? profile.mobile.trim().slice(0, 20) : "",
        backupMobile: typeof profile.backupMobile === "string" ? profile.backupMobile.trim().slice(0, 20) : "",
        educationLevel: typeof profile.educationLevel === "string" ? profile.educationLevel.trim().slice(0, 80) : "",
        currentlyStudying: profile.currentlyStudying === true,
        addresses: Array.isArray(profile.addresses) ? profile.addresses.slice(0, 5) : [],
      };
    } else {
      const user = await getAuthenticatedUser();
      if (purpose === "login") {
        const existing = await User.findOne({ email }).select("_id").lean();
        if (!existing) return NextResponse.json({ error: "No account found with this email." }, { status: 404 });
        userId = String(existing._id);
      } else {
        if (!user) return NextResponse.json({ error: "Please log in before changing your email." }, { status: 401 });
        if (user.email === email) return NextResponse.json({ error: "This is already your verified email." }, { status: 400 });
        if (await User.exists({ email })) return NextResponse.json({ error: "This email is already in use." }, { status: 409 });
        userId = String(user._id);
      }
    }

    const previous = await OtpChallenge.findOne({ email, purpose, consumedAt: null }).sort({ createdAt: -1 });
    if (previous && Date.now() - previous.lastSentAt.getTime() < RESEND_COOLDOWN_MS) {
      return NextResponse.json({ error: "Please wait 60 seconds before requesting another code." }, { status: 429 });
    }

    const code = createOtp();
    await OtpChallenge.create({
      email, purpose, codeHash: hashOtp(email, purpose, code),
      expiresAt: new Date(Date.now() + OTP_TTL_MS), attempts: 0,
      lastSentAt: new Date(), userId, pendingProfile,
    });

    try {
      await sendEmail(email, code);
    } catch (error) {
      await OtpChallenge.deleteOne({ email, purpose, codeHash: hashOtp(email, purpose, code) });
      throw error;
    }

    return NextResponse.json({ ok: true, message: "Verification code sent. It expires in 5 minutes." });
  } catch (error) {
    console.error("Email OTP send failed:", error);
    return NextResponse.json({ error: "Unable to send the verification code right now." }, { status: 503 });
  }
}
