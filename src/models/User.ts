import mongoose, { Schema, type Model } from "mongoose";

export interface UserAddress {
  _id?: mongoose.Types.ObjectId;
  label: string;
  line1: string;
  line2?: string;
  locality?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
}

export interface UserRecord {
  name: string;
  avatarUrl?: string;
  profilePhotoData?: string;
  dateOfBirth: Date;
  mobile: string;
  backupMobile?: string;
  email: string;
  emailVerified: boolean;
  addresses: UserAddress[];
  educationLevel: string;
  currentlyStudying: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const AddressSchema = new Schema<UserAddress>({
  label: { type: String, trim: true, maxlength: 40, default: "Home" },
  line1: { type: String, trim: true, maxlength: 160, required: true },
  line2: { type: String, trim: true, maxlength: 160 },
  locality: { type: String, trim: true, maxlength: 100 },
  city: { type: String, trim: true, maxlength: 80, required: true },
  state: { type: String, trim: true, maxlength: 80, required: true },
  postalCode: { type: String, trim: true, maxlength: 12, required: true },
  country: { type: String, trim: true, maxlength: 80, default: "India" },
  isPrimary: { type: Boolean, default: false },
}, { _id: true });

const UserSchema = new Schema<UserRecord>({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  avatarUrl: { type: String, trim: true, maxlength: 2048, default: "" },
  profilePhotoData: { type: String, maxlength: 1500000, default: "" },
  dateOfBirth: { type: Date, required: true },
  mobile: { type: String, trim: true, maxlength: 20, default: "" },
  backupMobile: { type: String, trim: true, maxlength: 20 },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
  emailVerified: { type: Boolean, default: false },
  addresses: { type: [AddressSchema], default: [] },
  educationLevel: { type: String, trim: true, maxlength: 80, default: "" },
  currentlyStudying: { type: Boolean, default: false },
}, { timestamps: true });

const User: Model<UserRecord> =
  (mongoose.models.User as Model<UserRecord>) ||
  mongoose.model<UserRecord>("User", UserSchema);

export default User;
