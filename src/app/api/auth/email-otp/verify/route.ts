import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { createUserSession, hashOtp, normalizeEmail } from "@/lib/auth";
import OtpChallenge from "@/models/OtpChallenge";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = typeof body.email === "string" ? normalizeEmail(body.email) : "";
    const code = typeof body.code === "string" ? body.code.trim() : "";
    const purpose = body.purpose;
    if (!email || !/^\d{6}$/.test(code) ||
        !["register", "login", "change-email"].includes(purpose)) {
      return NextResponse.json({ error: "Enter your email and the 6-digit verification code." }, { status: 400 });
    }

    await connectToDatabase();
    const challenge = await OtpChallenge.findOne({
      email, purpose, consumedAt: null, expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    if (!challenge) return NextResponse.json({ error: "The code has expired or was not found. Request a new one." }, { status: 400 });
    if (challenge.attempts >= 5) {
      await OtpChallenge.deleteOne({ _id: challenge._id });
      return NextResponse.json({ error: "Too many incorrect attempts. Request a new code." }, { status: 429 });
    }

    if (challenge.codeHash !== hashOtp(email, purpose, code)) {
      challenge.attempts += 1;
      await challenge.save();
      return NextResponse.json({ error: "Incorrect verification code." }, { status: 400 });
    }

    challenge.consumedAt = new Date();
    await challenge.save();

    let user;
    if (purpose === "register") {
      if (await User.exists({ email })) {
        return NextResponse.json({ error: "An account with this email already exists. Please log in." }, { status: 409 });
      }
      const profile = challenge.pendingProfile;
      if (!profile) return NextResponse.json({ error: "Registration details were not found. Please start again." }, { status: 400 });
      user = await User.create({
        ...profile,
        email,
        emailVerified: true,
      });
    } else if (purpose === "login") {
      user = await User.findOne({ email });
      if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });
    } else {
      user = await User.findById(challenge.userId);
      if (!user) return NextResponse.json({ error: "Account not found." }, { status: 404 });
      if (await User.exists({ email })) return NextResponse.json({ error: "This email is already in use." }, { status: 409 });
      user.email = email;
      user.emailVerified = true;
      await user.save();
    }

    await createUserSession(String(user._id));
    await OtpChallenge.deleteMany({ email, purpose });
    return NextResponse.json({ ok: true, message: "Email verified successfully.", redirectTo: "/account/profile" });
  } catch (error) {
    console.error("Email OTP verification failed:", error);
    return NextResponse.json({ error: "Unable to verify the code right now." }, { status: 503 });
  }
}
