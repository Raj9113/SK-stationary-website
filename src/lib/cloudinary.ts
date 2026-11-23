import { createHash } from "node:crypto";

/**
 * Removes an image from the product Cloudinary folder.
 * Logs diagnostic outcomes without ever logging credentials or signatures.
 */
export async function deleteProductImage(publicId: string): Promise<boolean> {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error("[product-image-cleanup] skipped: Cloudinary credentials missing", {
      cloudNameConfigured: Boolean(cloudName),
      apiKeyConfigured: Boolean(apiKey),
      apiSecretConfigured: Boolean(apiSecret),
    });
    return false;
  }
  if (!publicId.startsWith("sk-stationary/products/")) {
    console.warn("[product-image-cleanup] skipped: public ID outside allowed folder", { publicId });
    return false;
  }

  const timestamp = Math.floor(Date.now() / 1000).toString();
  const signaturePayload = `public_id=${publicId}&timestamp=${timestamp}${apiSecret}`;
  const signature = createHash("sha1").update(signaturePayload).digest("hex");

  const body = new FormData();
  body.append("public_id", publicId);
  body.append("api_key", apiKey);
  body.append("timestamp", timestamp);
  body.append("signature", signature);

  let response: Response;
  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${encodeURIComponent(cloudName)}/image/destroy`,
      { method: "POST", body, cache: "no-store" }
    );
  } catch (error) {
    console.error("[product-image-cleanup] network request failed", {
      publicId,
      error: error instanceof Error ? error.message : String(error),
    });
    return false;
  }

  let result: { result?: string; error?: { message?: string } } = {};
  try {
    result = await response.json() as typeof result;
  } catch {
    console.error("[product-image-cleanup] Cloudinary returned non-JSON response", {
      publicId,
      httpStatus: response.status,
    });
    return false;
  }

  const deleted = response.ok && (result.result === "ok" || result.result === "not found");
  const details = {
    publicId,
    httpStatus: response.status,
    result: result.result ?? null,
    error: result.error?.message ?? null,
  };

  if (deleted) {
    console.info("[product-image-cleanup] Cloudinary confirmed deletion", details);
  } else {
    console.error("[product-image-cleanup] Cloudinary did not confirm deletion", details);
  }
  return deleted;
}
