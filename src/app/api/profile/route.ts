import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getAuthenticatedUser } from "@/lib/auth";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
    return NextResponse.json({ user });
  } catch (error) {
    console.error("Profile read failed:", error);
    return NextResponse.json({ error: "Unable to load profile." }, { status: 503 });
  }
}

export async function PATCH(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
    const body = await request.json();
    const allowed: Record<string, unknown> = {};
    if (typeof body.name === "string" && body.name.trim()) allowed.name = body.name.trim().slice(0, 100);
    if (typeof body.mobile === "string") allowed.mobile = body.mobile.trim().slice(0, 20);
    if (typeof body.backupMobile === "string") allowed.backupMobile = body.backupMobile.trim().slice(0, 20);
    if (typeof body.educationLevel === "string") allowed.educationLevel = body.educationLevel.trim().slice(0, 80);
    if (typeof body.currentlyStudying === "boolean") allowed.currentlyStudying = body.currentlyStudying;
    if (typeof body.dateOfBirth === "string") {
      const dob = new Date(body.dateOfBirth);
      const age = (Date.now() - dob.getTime()) / (365.2425 * 24 * 60 * 60 * 1000);
      if (Number.isNaN(dob.getTime()) || dob >= new Date() || age > 120) {
        return NextResponse.json({ error: "Enter a valid date of birth." }, { status: 400 });
      }
      allowed.dateOfBirth = dob;
    }
    if (Array.isArray(body.addresses)) {
      if (body.addresses.length > 5) return NextResponse.json({ error: "You can save up to 5 addresses." }, { status: 400 });
      allowed.addresses = body.addresses.map((a: Record<string, unknown>, index: number) => ({
        label: typeof a.label === "string" ? a.label.slice(0, 40) : "Home",
        line1: typeof a.line1 === "string" ? a.line1.trim().slice(0, 160) : "",
        line2: typeof a.line2 === "string" ? a.line2.trim().slice(0, 160) : "",
        locality: typeof a.locality === "string" ? a.locality.trim().slice(0, 100) : "",
        city: typeof a.city === "string" ? a.city.trim().slice(0, 80) : "",
        state: typeof a.state === "string" ? a.state.trim().slice(0, 80) : "",
        postalCode: typeof a.postalCode === "string" ? a.postalCode.trim().slice(0, 12) : "",
        country: typeof a.country === "string" ? a.country.trim().slice(0, 80) : "India",
        isPrimary: a.isPrimary === true || (index === 0 && body.addresses.length === 1),
      }));
      for (const address of allowed.addresses as Array<Record<string, string>>) {
        if (!address.line1 || !address.city || !address.state || !address.postalCode) {
          return NextResponse.json({ error: "Each address needs address line, city, state and postal code." }, { status: 400 });
        }
      }
      if ((allowed.addresses as Array<{isPrimary:boolean}>).length &&
          !(allowed.addresses as Array<{isPrimary:boolean}>).some((a) => a.isPrimary)) {
        (allowed.addresses as Array<{isPrimary:boolean}>)[0].isPrimary = true;
      }
    }
    await connectToDatabase();
    const updated = await User.findByIdAndUpdate(user._id, { $set: allowed }, { new: true, runValidators: true }).select("-__v").lean();
    return NextResponse.json({ user: updated });
  } catch (error) {
    console.error("Profile update failed:", error);
    return NextResponse.json({ error: "Unable to update profile." }, { status: 503 });
  }
}
