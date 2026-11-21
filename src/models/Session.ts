import mongoose, { Schema, type Model } from "mongoose";

export interface SessionRecord {
  userId: mongoose.Types.ObjectId;
  tokenHash: string;
  expiresAt: Date;
}

const SessionSchema = new Schema<SessionRecord>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  tokenHash: { type: String, required: true, unique: true },
  expiresAt: { type: Date, required: true, index: { expires: 0 } },
}, { timestamps: true });

const Session: Model<SessionRecord> =
  (mongoose.models.Session as Model<SessionRecord>) ||
  mongoose.model<SessionRecord>("Session", SessionSchema);

export default Session;
