import mongoose, { Schema } from 'mongoose';

const LentMoneySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    personName: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    isReceived: {
      type: Boolean,
      default: false,
    },
    receivedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

LentMoneySchema.index({ user: 1, isReceived: 1 });

const LentMoney = mongoose.model('LentMoney', LentMoneySchema);
export default LentMoney;
