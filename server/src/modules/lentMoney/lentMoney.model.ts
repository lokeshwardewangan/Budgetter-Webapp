import mongoose, { Schema, type Types } from 'mongoose';

export interface ILentMoney {
  user: Types.ObjectId;
  personName: string;
  price: number;
  date: Date;
  isReceived: boolean;
  receivedAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const LentMoneySchema = new Schema<ILentMoney>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    personName: { type: String, required: true, trim: true },
    price: { type: Number, required: true, min: 0 },
    date: { type: Date, required: true, default: Date.now },
    isReceived: { type: Boolean, default: false },
    receivedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

LentMoneySchema.index({ user: 1, isReceived: 1 });

const LentMoney = mongoose.model<ILentMoney>('LentMoney', LentMoneySchema);
export default LentMoney;
