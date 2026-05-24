import mongoose, { Schema } from 'mongoose';

const PocketMoneySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    amount: {
      type: Number,
      required: true,
      min: 0,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
  },
  { timestamps: true },
);

PocketMoneySchema.index({ user: 1, createdAt: -1 });

const PocketMoney = mongoose.model('PocketMoney', PocketMoneySchema);
export default PocketMoney;
