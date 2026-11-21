import mongoose, { Schema, type Model } from "mongoose";

export interface ProductRecord {
  name: string;
  sku: string;
  category: string;
  price: number;
  compareAt: number;
  stock: number;
  description: string;
  image: string;
  imagePublicId?: string;
  status: "Active" | "Draft";
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export const PRODUCT_CATEGORIES = [
  "Notebooks & Registers",
  "Pens & Writing",
  "Art & Craft",
  "Files & Folders",
  "Printing & Paper",
  "School Essentials",
  "Office Stationery",
  "Inks & Refills",
  "Exam & Academic",
  "Other",
] as const;

const ProductSchema = new Schema<ProductRecord>(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 160 },
    sku: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
      maxlength: 64,
      match: /^[A-Z0-9][A-Z0-9._-]*$/,
    },
    category: { type: String, required: true, enum: PRODUCT_CATEGORIES },
    price: { type: Number, required: true, min: 0, validate: Number.isFinite },
    compareAt: { type: Number, default: 0, min: 0, validate: Number.isFinite },
    stock: { type: Number, default: 0, min: 0, validate: Number.isInteger },
    description: { type: String, default: "", maxlength: 3000 },
    image: { type: String, default: "", maxlength: 2048 },
    imagePublicId: { type: String, default: "", maxlength: 255 },
    status: { type: String, enum: ["Active", "Draft"], default: "Draft" },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductSchema.index({ status: 1, featured: -1, createdAt: -1 });

const Product: Model<ProductRecord> =
  (mongoose.models.Product as Model<ProductRecord>) ||
  mongoose.model<ProductRecord>("Product", ProductSchema);

export default Product;
