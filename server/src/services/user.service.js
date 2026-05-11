import bcrypt from 'bcrypt';
import UserModel from '../models/user.model.js';
import PocketMoneyModel from '../models/pocketMoney.model.js';
import LentMoneyModel from '../models/lentMoney.model.js';
import ActiveSessionModel from '../models/activeSession.model.js';
import ExpenseModel from '../models/expenses.model.js';
import DeletedUserModel from '../models/deletedUser.model.js';
import { ApiError } from '../utils/ApiError.js';
import { uploadOnCloudinary } from '../utils/cloudinary.js';
import { sendMessageToUser } from '../utils/EmailSend.js';

export async function generateUniqueUsername(name) {
  const base = name.toLowerCase().replace(/\s+/g, '');
  let username = base;
  let count = 1;
  while (await UserModel.findOne({ username })) {
    username = `${base}${count++}`;
  }
  return username;
}

export async function getMe(userId, currentToken) {
  const [user, pocketMoneyHistory, lentMoneyHistory, currentSession] = await Promise.all([
    UserModel.findById(userId).select('-password'),
    PocketMoneyModel.find({ user: userId }).sort({ createdAt: -1 }).lean(),
    LentMoneyModel.find({ user: userId }).sort({ createdAt: -1 }).lean(),
    ActiveSessionModel.findOne({ user: userId, token: currentToken }).lean(),
  ]);

  if (!user) throw new ApiError(404, 'User not found');

  return {
    _id: user._id,
    username: user.username,
    name: user.name,
    email: user.email,
    avatar: user.avatar,
    isVerified: user.isVerified,
    currentPocketMoney: user.currentPocketMoney,
    profession: user.profession,
    dob: user.dateOfBirth,
    instagramLink: user.instagramLink,
    facebookLink: user.facebookLink,
    createdAt: user.createdAt,
    lastLogin: user.lastLogin,
    pocketMoneyHistory,
    lentMoneyHistory,
    currentSession: currentSession ? [currentSession] : [],
  };
}

export async function updateProfile(userId, body) {
  const { name, dob, currentPassword, newPassword, instagramLink, facebookLink, profession } = body;

  if (
    !name &&
    !dob &&
    !currentPassword &&
    !newPassword &&
    !instagramLink &&
    !facebookLink &&
    !profession
  ) {
    throw new ApiError(400, 'At least one field must be provided to update.');
  }

  const updates = {};
  if (name) updates.name = name;
  if (dob) updates.dateOfBirth = dob;
  if (instagramLink) updates.instagramLink = instagramLink;
  if (facebookLink) updates.facebookLink = facebookLink;
  if (profession) updates.profession = profession;

  if (currentPassword && newPassword) {
    const user = await UserModel.findById(userId).select('+password');
    if (!user?.password) throw new ApiError(500, 'User password not set.');
    const ok = await bcrypt.compare(currentPassword, user.password);
    if (!ok) throw new ApiError(401, 'Current password is incorrect.');
    updates.password = await bcrypt.hash(newPassword, 10);
  }

  const updated = await UserModel.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true },
  ).select('-password');
  if (!updated) throw new ApiError(404, 'User not found');
  return updated;
}

export async function updateAvatar(userId, localFilePath) {
  if (!localFilePath) throw new ApiError(400, 'Avatar file is required');

  const uploaded = await uploadOnCloudinary(localFilePath);
  if (!uploaded?.secure_url) throw new ApiError(500, 'Failed to upload avatar');

  const updated = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { avatar: uploaded.secure_url } },
    { new: true },
  ).select('avatar');
  if (!updated) throw new ApiError(500, 'Avatar not updated');
  return updated;
}

export async function deleteAccount(userId, providedPassword) {
  const user = await UserModel.findById(userId).select('+password');
  if (!user) throw new ApiError(404, 'User not found');

  const ok = await user.isPasswordMatch(providedPassword);
  if (!ok) throw new ApiError(401, 'Invalid password');

  const { name, username, email, avatar, currentPocketMoney } = user;

  await Promise.all([
    ExpenseModel.deleteMany({ user: userId }),
    PocketMoneyModel.deleteMany({ user: userId }),
    LentMoneyModel.deleteMany({ user: userId }),
    ActiveSessionModel.deleteMany({ user: userId }),
  ]);

  await UserModel.deleteOne({ _id: userId });

  await DeletedUserModel.create({ name, username, email, avatar, currentPocketMoney });

  // Best-effort acknowledgment email; don't block the deletion on email failure.
  sendMessageToUser(
    username,
    'DELETE_ACCOUNT',
    email,
    'Budgetter - Account Deletion Confirmation',
    '',
  ).catch((err) => console.error('delete-account email failed:', err));
}

// Atomically adjust the cached running balance on User. Returns the new balance.
export async function adjustBalance(userId, delta) {
  const user = await UserModel.findById(userId);
  if (!user) throw new ApiError(404, 'User not found');
  const next = parseFloat(user.currentPocketMoney || '0') + Number(delta);
  if (Number.isNaN(next)) throw new ApiError(500, 'Balance calculation failed');
  user.currentPocketMoney = next.toString();
  await user.save({ validateBeforeSave: false });
  return user.currentPocketMoney;
}
