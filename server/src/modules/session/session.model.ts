import mongoose, { Schema, type Types } from 'mongoose';

export interface IActiveSession {
  user: Types.ObjectId;
  tokenHash: string;
  ip: string;
  userAgent: string;
  lastUsedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ActiveSessionSchema = new Schema<IActiveSession>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    // sha256(JWT) — never store the raw JWT (DB leak = full impersonation).
    tokenHash: { type: String, required: true, index: true },
    ip: { type: String, required: true },
    userAgent: { type: String, required: true },
    // TTL: Mongo auto-deletes sessions idle for 30 days.
    lastUsedAt: { type: Date, default: Date.now, index: { expires: '30d' } },
  },
  { timestamps: true },
);

const ActiveSession = mongoose.model<IActiveSession>('ActiveSession', ActiveSessionSchema);
export default ActiveSession;
