import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import UserModel from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { sendMessageToUser } from '../utils/EmailSend.js';
import { generateUniqueUsername } from './user.service.js';
import { createSession } from './session.service.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

async function sendVerificationEmail(user) {
  const token = jwt.sign({ _id: user._id }, process.env.ACCOUNT_VERIFICATION_TOKEN_SECRET, {
    expiresIn: process.env.ACCOUNT_VERIFICATION_TOKEN_SECRET_EXPIRY,
  });
  const ok = await sendMessageToUser(
    user.name,
    'VERIFY_ACCOUNT',
    user.email,
    'Budgetter Account Verification',
    token,
  );
  if (!ok) console.error(`Verification email failed for ${user.email}`);
}

async function buildUserAndSession({ name, email, password, googleId, picture }, req) {
  const username = await generateUniqueUsername(name);
  const data = { username, name, email };
  if (password) data.password = password;
  if (googleId) {
    data.googleId = googleId;
    data.authProvider = 'google';
    data.isVerified = true;
  }
  if (picture) data.avatar = picture;

  const user = await UserModel.create(data);
  const token = await createSession(user, req);
  const safeUser = await UserModel.findById(user._id).select('-password');
  return { user: safeUser, token };
}

export async function registerLocal({ username, name, email, password }, req) {
  const existing = await UserModel.findOne({ $or: [{ username }, { email }] });
  if (existing) throw new ApiError(409, 'User with this username or email already exists');

  const { user, token } = await buildUserAndSession({ name, email, password }, req);
  sendVerificationEmail(user).catch((err) => console.error('verify email failed:', err));
  return { user, token };
}

export async function loginLocal({ username, email, password }, req) {
  // Only include populated fields in the $or — Mongoose strips undefined
  // values, which would turn `{ email: undefined }` into `{}` and match
  // every document via $or. Build the filter explicitly to avoid that.
  const filters = [];
  if (email) filters.push({ email });
  if (username) filters.push({ username });
  if (filters.length === 0) throw new ApiError(400, 'username or email is required');

  const existing = await UserModel.findOne({ $or: filters }).select('+password');
  if (!existing) throw new ApiError(404, 'User does not exist');

  const ok = await existing.isPasswordMatch(password);
  if (!ok) throw new ApiError(401, 'Invalid credentials');

  const token = await createSession(existing, req);
  const user = await UserModel.findById(existing._id).select('-password');
  return { user, token };
}

export async function loginWithGoogle(idToken, req) {
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const { sub: googleId, email, name, picture } = payload;

  const existing = await UserModel.findOne({ $or: [{ googleId }, { email }] });
  if (existing) {
    const token = await createSession(existing, req);
    return { user: existing, token, isNewUser: false };
  }

  const { user, token } = await buildUserAndSession({ name, email, googleId, picture }, req);
  return { user, token, isNewUser: true };
}

export async function verifyAccountToken(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.ACCOUNT_VERIFICATION_TOKEN_SECRET);
  } catch {
    throw new ApiError(400, 'Invalid or expired verification token');
  }
  const user = await UserModel.findById(decoded._id);
  if (!user) throw new ApiError(404, 'User not found');

  if (user.isVerified) return { alreadyVerified: true };
  user.isVerified = true;
  await user.save({ validateBeforeSave: false });
  return { alreadyVerified: false };
}

export async function requestPasswordReset(email) {
  const user = await UserModel.findOne({ email });
  if (!user) throw new ApiError(404, 'User not found');

  const token = jwt.sign({ _id: user._id }, process.env.RESET_PASSWORD_TOKEN_SECRET, {
    expiresIn: process.env.RESET_PASSWORD_TOKEN_SECRET_EXPIRY,
  });

  const ok = await sendMessageToUser(
    user.name,
    'RESET_PASSWORD',
    user.email,
    'Budgetter Password Reset',
    token,
  );
  if (!ok) throw new ApiError(500, 'Failed to send password reset email');
}

export async function validatePasswordResetToken(token) {
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.RESET_PASSWORD_TOKEN_SECRET);
  } catch {
    throw new ApiError(400, 'Invalid or expired reset token');
  }
  const user = await UserModel.findById(decoded._id).select('_id');
  if (!user) throw new ApiError(404, 'User not found');
  return user._id;
}

export async function resetPassword(userId, newPassword) {
  const hash = await bcrypt.hash(newPassword, 10);
  const updated = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { password: hash } },
    { new: true },
  );
  if (!updated) throw new ApiError(404, 'User not found');
}
