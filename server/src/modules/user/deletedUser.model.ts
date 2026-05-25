import mongoose, { Schema } from 'mongoose';

export interface IDeletedUser {
  username: string;
  name: string;
  email: string;
  avatar: string;
  currentPocketMoney: number;
  createdAt: Date;
  updatedAt: Date;
}

const deletedUserSchema = new Schema<IDeletedUser>(
  {
    username: { type: String, required: true },
    name: { type: String, required: true },
    email: { type: String, required: true, lowercase: true },
    avatar: { type: String, required: true },
    currentPocketMoney: { type: Number, default: 0 },
  },
  { timestamps: true },
);

const deletedUser = mongoose.model<IDeletedUser>('deletedUser', deletedUserSchema);
export default deletedUser;
