import { createHash } from "node:crypto";

/**
 * Removes an image from the product Cloudinary folder.
 * Returns false when Cloudinary does not confirm deletion.
 */
export async function deleteProductImage(publicId: string): Promise<boolean> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) return false;
  if (!publicId.startsWith("sk-stationary/products/")) return false;

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signaturePayload = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(signaturePayload).digest("hex");

  const body = new FormData();
  body.append("public_id", publicId);
  body.append("api_key", apiKey);
  body.append("timestamp", timestamp);
  body.append("signature", signature);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/destroy`,
    { method: "POST", body, cache: "no-store" }
  );

  if (!response.ok) return false;
  const result = await response.json() as { result?: string };
  return result.result === "ok" || result.result === "not found";
}
