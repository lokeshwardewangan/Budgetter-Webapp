import mongoose, { Schema } from 'mongoose';

const ActiveSessionSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    token: {
      type: String,
      required: true,
      index: true,
    },
    ip: {
      type: String,
      required: true,
    },
    userAgent: {
      type: String,
      required: true,
    },
    // TTL: Mongo auto-deletes sessions idle for 30 days.
    lastUsedAt: {
      type: Date,
      default: Date.now,
      index: { expires: '30d' },
    },
  },
  { timestamps: true },
);

const ActiveSession = mongoose.model('ActiveSession', ActiveSessionSchema);
export default ActiveSession;
