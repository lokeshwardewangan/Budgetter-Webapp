import mongoose, { Schema, type Types } from 'mongoose';

export interface IPocketMoney {
  user: Types.ObjectId;
  amount: number;
  source: string;
  date: Date;
  createdAt: Date;
  updatedAt: Date;
}

const PocketMoneySchema = new Schema<IPocketMoney>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true, min: 0 },
    source: { type: String, required: true, trim: true },
    date: { type: Date, required: true, default: Date.now },
  },
  { timestamps: true },
);

PocketMoneySchema.index({ user: 1, createdAt: -1 });

const PocketMoney = mongoose.model<IPocketMoney>('PocketMoney', PocketMoneySchema);
export default PocketMoney;
