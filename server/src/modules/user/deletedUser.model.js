import mongoose, { Schema } from 'mongoose';

const deletedUserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    currentPocketMoney: {
      type: String,
      default: '0',
    },
  },
  {
    timestamps: true,
  },
);

const deletedUser = mongoose.model('deletedUser', deletedUserSchema);
export default deletedUser;
