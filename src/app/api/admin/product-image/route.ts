import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { getAdminAccess } from "@/lib/admin-auth";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/avif"]);

export async function POST(request: Request) {
  try {
    const access = await getAdminAccess();
    if (!access.authorized) {
      return NextResponse.json(
        { ok: false, message: access.reason === "unauthenticated" ? "Please log in." : "Administrator access required." },
        { status: access.reason === "unauthenticated" ? 401 : 403 }
      );
    }

    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;
    if (!cloudName || !apiKey || !apiSecret) {
      console.error("Cloudinary environment variables are incomplete.");
      return NextResponse.json({ ok: false, message: "Image service is not configured." }, { status: 503 });
    }

    let form: FormData;
    try { form = await request.formData(); }
    catch { return NextResponse.json({ ok: false, message: "Invalid upload request." }, { status: 400 }); }

    const file = form.get("file");
    if (!(file instanceof File)) return NextResponse.json({ ok: false, message: "Choose an image to upload." }, { status: 400 });
    if (!ALLOWED_TYPES.has(file.type)) return NextResponse.json({ ok: false, message: "Use a JPG, PNG, WebP or AVIF image." }, { status: 415 });
    if (file.size <= 0 || file.size > MAX_IMAGE_BYTES) return NextResponse.json({ ok: false, message: "Image must be smaller than 5 MB." }, { status: 413 });

    const timestamp = Math.floor(Date.now() / 1000).toString();
    const folder = "sk-stationary/products";
    const signaturePayload = `folder=${folder}&timestamp=${timestamp}${apiSecret}`;
    const signature = createHash("sha1").update(signaturePayload).digest("hex");

    const cloudForm = new FormData();
    cloudForm.append("file", new Blob([await file.arrayBuffer()], { type: file.type }), file.name);
    cloudForm.append("api_key", apiKey);
    cloudForm.append("timestamp", timestamp);
    cloudForm.append("folder", folder);
    cloudForm.append("signature", signature);

    const response = await fetch(`https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/upload`, {
      method: "POST",
      body: cloudForm,
      cache: "no-store",
    });
    const result = await response.json() as {
      secure_url?: string;
      public_id?: string;
      error?: { message?: string };
    };

    if (!response.ok || !result.secure_url || !result.public_id) {
      console.error("Cloudinary upload failed:", result.error?.message ?? response.status);
      return NextResponse.json({ ok: false, message: "Cloudinary could not upload this image. Please try again." }, { status: 502 });
    }

    return NextResponse.json({ ok: true, image: result.secure_url, imagePublicId: result.public_id });
  } catch (error) {
    console.error("Product image upload failed:", error);
    return NextResponse.json({ ok: false, message: "Unable to upload image right now." }, { status: 503 });
  }
}
