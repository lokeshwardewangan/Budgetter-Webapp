import mongoose, { Schema } from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const UserSchema = new Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    avatar: {
      type: String,
      default: 'https://i.postimg.cc/cCWKmfzs/satoro-1.jpg',
    },
    dob: {
      type: Date,
      default: null,
    },
    profession: {
      type: String,
      default: '',
    },
    instagramLink: {
      type: String,
      default: '',
    },
    facebookLink: {
      type: String,
      default: '',
    },
    // Denormalized running balance; reconcile from PocketMoney + LentMoney + Expense if it drifts.
    currentPocketMoney: {
      type: Number,
      default: 0,
    },
    password: {
      type: String,
      required: function () {
        return this.authProvider === 'local';
      },
    },
    googleId: {
      type: String,
      default: null,
    },
    authProvider: {
      type: String,
      enum: ['google', 'local'],
      required: true,
      default: 'local',
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    lastLogin: {
      type: Date,
      default: null,
    },
    currentLogin: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

// Sparse so non-Google users (googleId: null) don't all collide on the index.
UserSchema.index({ googleId: 1 }, { sparse: true });

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.isPasswordMatch = async function (password) {
  return bcrypt.compare(password, this.password);
};

UserSchema.methods.generateAccessToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
      email: this.email,
      name: this.name,
    },
    process.env.ACCESS_TOKEN_SECRET_KEY,
    {
      expiresIn: process.env.ACCESS_TOKEN_SECRET_EXPIRY,
    },
  );
};

UserSchema.methods.generateResetPasswordToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
    },
    process.env.RESET_PASSWORD_TOKEN_SECRET,
    {
      expiresIn: process.env.RESET_PASSWORD_TOKEN_SECRET_EXPIRY,
    },
  );
};

UserSchema.methods.generateAccountVerificationToken = async function () {
  return await jwt.sign(
    {
      _id: this._id,
    },
    process.env.ACCOUNT_VERIFICATION_TOKEN_SECRET,
    {
      expiresIn: process.env.ACCOUNT_VERIFICATION_TOKEN_SECRET_EXPIRY,
    },
  );
};

const User = mongoose.model('User', UserSchema);
export default User;
