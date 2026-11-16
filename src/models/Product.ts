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
  status: "Active" | "Draft";
  featured: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const ProductSchema = new Schema<ProductRecord>(
  {
    name: { type: String, required: true, trim: true, maxlength: 160 },
    sku: { type: String, required: true, trim: true, uppercase: true, unique: true, maxlength: 64 },
    category: { type: String, required: true, trim: true, maxlength: 80 },
    price: { type: Number, required: true, min: 0 },
    compareAt: { type: Number, default: 0, min: 0 },
    stock: { type: Number, default: 0, min: 0, validate: Number.isInteger },
    description: { type: String, default: "", maxlength: 3000 },
    image: { type: String, default: "", maxlength: 2048 },
    status: { type: String, enum: ["Active", "Draft"], default: "Draft" },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const Product: Model<ProductRecord> =
  (mongoose.models.Product as Model<ProductRecord>) ||
  mongoose.model<ProductRecord>("Product", ProductSchema);

export default Product;
