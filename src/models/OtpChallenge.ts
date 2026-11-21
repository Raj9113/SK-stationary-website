import mongoose, { Schema, type Model } from "mongoose";

export type OtpPurpose = "register" | "login" | "change-email";

export interface OtpChallengeRecord {
  email: string;
  purpose: OtpPurpose;
  codeHash: string;
  expiresAt: Date;
  attempts: number;
  lastSentAt: Date;
  consumedAt?: Date;
  userId?: mongoose.Types.ObjectId;
  pendingProfile?: Record<string, unknown>;
}

const OtpChallengeSchema = new Schema<OtpChallengeRecord>({
  email: { type: String, required: true, lowercase: true, trim: true, index: true },
  purpose: { type: String, enum: ["register", "login", "change-email"], required: true },
  codeHash: { type: String, required: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
  attempts: { type: Number, default: 0 },
  lastSentAt: { type: Date, required: true },
  consumedAt: { type: Date },
  userId: { type: Schema.Types.ObjectId, ref: "User" },
  pendingProfile: { type: Schema.Types.Mixed },
}, { timestamps: true });

const OtpChallenge: Model<OtpChallengeRecord> =
  (mongoose.models.OtpChallenge as Model<OtpChallengeRecord>) ||
  mongoose.model<OtpChallengeRecord>("OtpChallenge", OtpChallengeSchema);

export default OtpChallenge;
