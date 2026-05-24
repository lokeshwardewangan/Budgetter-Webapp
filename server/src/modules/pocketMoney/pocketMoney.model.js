import mongoose, { Schema } from 'mongoose';

const PocketMoneySchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    amount: {
      type: String,
      required: true,
    },
    source: {
      type: String,
      required: true,
      trim: true,
    },
    date: {
      type: String,
      required: true,
      default: () => {
        const now = new Date();
        const day = String(now.getDate()).padStart(2, '0');
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const year = String(now.getFullYear()).slice(-2);
        return `${day}-${month}-${year}`;
      },
    },
  },
  { timestamps: true },
);

const PocketMoney = mongoose.model('PocketMoney', PocketMoneySchema);
export default PocketMoney;
