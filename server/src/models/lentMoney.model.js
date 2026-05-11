import mongoose, { Schema } from 'mongoose';

const LentMoneySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    personName: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: String,
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    isReceived: {
      type: Boolean,
      default: false,
      index: true,
    },
    receivedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true },
);

const LentMoney = mongoose.model('LentMoney', LentMoneySchema);
export default LentMoney;
