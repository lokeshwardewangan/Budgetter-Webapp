import mongoose, { Schema, type Model, type HydratedDocument } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt, { type SignOptions } from 'jsonwebtoken';

export interface IUser {
  username: string;
  name: string;
  email: string;
  avatar: string;
  dob: Date | null;
  profession: string;
  instagramLink: string;
  facebookLink: string;
  currentPocketMoney: number;
  password?: string;
  googleId: string | null;
  authProvider: 'google' | 'local';
  isVerified: boolean;
  role: 'user' | 'admin';
  passwordResetTokenHash: string | null;
  lastLogin: Date | null;
  currentLogin: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface IUserMethods {
  isPasswordMatch(password: string): Promise<boolean>;
  generateAccessToken(): Promise<string>;
  generateResetPasswordToken(): Promise<string>;
  generateAccountVerificationToken(): Promise<string>;
}

export type UserDocument = HydratedDocument<IUser, IUserMethods>;
type UserModelType = Model<IUser, {}, IUserMethods>;

const UserSchema = new Schema<IUser, UserModelType, IUserMethods>(
  {
    username: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    avatar: { type: String, default: 'https://i.postimg.cc/cCWKmfzs/satoro-1.jpg' },
    dob: { type: Date, default: null },
    profession: { type: String, default: '' },
    instagramLink: { type: String, default: '' },
    facebookLink: { type: String, default: '' },
    // Denormalized running balance; reconcile from PocketMoney + LentMoney + Expense if it drifts.
    currentPocketMoney: { type: Number, default: 0 },
    password: {
      type: String,
      required: function (this: IUser) {
        return this.authProvider === 'local';
      },
    },
    googleId: { type: String, default: null },
    authProvider: { type: String, enum: ['google', 'local'], required: true, default: 'local' },
    isVerified: { type: Boolean, default: false },
    role: { type: String, enum: ['user', 'admin'], default: 'user' },
    // sha256 of the most recently issued reset JWT — non-null only while
    // a reset is pending. Cleared on successful password reset.
    passwordResetTokenHash: { type: String, default: null, select: false },
    lastLogin: { type: Date, default: null },
    currentLogin: { type: Date, default: null },
  },
  { timestamps: true },
);

// Sparse so non-Google users (googleId: null) don't all collide on the index.
UserSchema.index({ googleId: 1 }, { sparse: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.isPasswordMatch = async function (password: string): Promise<boolean> {
  return bcrypt.compare(password, this.password ?? '');
};

UserSchema.methods.generateAccessToken = async function (): Promise<string> {
  return jwt.sign(
    { _id: this._id, email: this.email, name: this.name },
    process.env.ACCESS_TOKEN_SECRET_KEY as string,
    { expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRY as SignOptions['expiresIn'] },
  );
};

UserSchema.methods.generateResetPasswordToken = async function (): Promise<string> {
  return jwt.sign({ _id: this._id }, process.env.RESET_PASSWORD_TOKEN_SECRET as string, {
    expiresIn: process.env.RESET_PASSWORD_TOKEN_SECRET_EXPIRY as SignOptions['expiresIn'],
  });
};

UserSchema.methods.generateAccountVerificationToken = async function (): Promise<string> {
  return jwt.sign({ _id: this._id }, process.env.ACCOUNT_VERIFICATION_TOKEN_SECRET as string, {
    expiresIn: process.env.ACCOUNT_VERIFICATION_TOKEN_SECRET_EXPIRY as SignOptions['expiresIn'],
  });
};

const User = mongoose.model<IUser, UserModelType>('User', UserSchema);
export default User;
