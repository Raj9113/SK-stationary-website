import { PRODUCT_CATEGORIES } from "@/models/Product";

export type ProductInput = {
  name?: unknown;
  sku?: unknown;
  category?: unknown;
  price?: unknown;
  compareAt?: unknown;
  stock?: unknown;
  description?: unknown;
  image?: unknown;
  imagePublicId?: unknown;
  status?: unknown;
  featured?: unknown;
};

export function normalizeProduct(body: ProductInput) {
  const name = typeof body.name === "string" ? body.name.trim() : "";
  const sku = typeof body.sku === "string" ? body.sku.trim().toUpperCase() : "";
  const category = typeof body.category === "string" ? body.category.trim() : "";
  const price = Number(body.price);
  const compareAt = body.compareAt === undefined || body.compareAt === null || body.compareAt === "" ? 0 : Number(body.compareAt);
  const stock = body.stock === undefined || body.stock === null || body.stock === "" ? 0 : Number(body.stock);
  const description = typeof body.description === "string" ? body.description.trim() : "";
  const image = typeof body.image === "string" ? body.image.trim() : "";
  const imagePublicId = typeof body.imagePublicId === "string" ? body.imagePublicId.trim() : "";
  const status = body.status === "Active" ? "Active" : body.status === "Draft" || body.status === undefined ? "Draft" : null;
  const featured = body.featured === true;

  if (name.length < 2 || name.length > 160) return { error: "Product name must be between 2 and 160 characters." } as const;
  if (!/^[A-Z0-9][A-Z0-9._-]{0,63}$/.test(sku)) return { error: "Enter a valid SKU using letters, numbers, dots, underscores or hyphens." } as const;
  if (!(PRODUCT_CATEGORIES as readonly string[]).includes(category)) return { error: "Choose a valid product category." } as const;
  if (!Number.isFinite(price) || price < 0) return { error: "Enter a valid selling price." } as const;
  if (!Number.isFinite(compareAt) || compareAt < 0 || (compareAt > 0 && compareAt < price)) return { error: "MRP must be greater than or equal to the selling price." } as const;
  if (!Number.isInteger(stock) || stock < 0) return { error: "Stock must be a whole number greater than or equal to zero." } as const;
  if (description.length > 3000) return { error: "Description cannot exceed 3,000 characters." } as const;
  if (image && (!image.startsWith("https://res.cloudinary.com/") || image.length > 2048)) return { error: "Product image must be a valid Cloudinary HTTPS URL." } as const;
  if (imagePublicId.length > 255) return { error: "Invalid image reference." } as const;
  if (!status) return { error: "Choose Active or Draft status." } as const;

  return { value: { name, sku, category, price, compareAt, stock, description, image, imagePublicId, status, featured } } as const;
}
