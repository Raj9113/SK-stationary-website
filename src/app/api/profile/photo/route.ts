import { NextResponse } from "next/server";
import { getAuthenticatedUser } from "@/lib/auth";
import { connectToDatabase } from "@/lib/mongodb";
import User from "@/models/User";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const user = await getAuthenticatedUser();
    if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
    const body = await request.json();
    const image = typeof body.image === "string" ? body.image : "";
    if (!/^data:image\/(jpeg|png|webp);base64,/.test(image)) {
      return NextResponse.json({ error: "Upload a JPG, PNG or WebP image." }, { status: 400 });
    }
    if (image.length > 1400000) return NextResponse.json({ error: "Image must be smaller than 1 MB." }, { status: 413 });
    await connectToDatabase();
    await User.findByIdAndUpdate(user._id, { $set: { profilePhotoData: image, avatarUrl: "" } });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Profile photo upload failed:", error);
    return NextResponse.json({ error: "Unable to save profile photo." }, { status: 500 });
  }
}

export async function DELETE() {
  const user = await getAuthenticatedUser();
  if (!user) return NextResponse.json({ error: "Please log in." }, { status: 401 });
  await connectToDatabase();
  await User.findByIdAndUpdate(user._id, { $set: { profilePhotoData: "", avatarUrl: "" } });
  return NextResponse.json({ ok: true });
}
