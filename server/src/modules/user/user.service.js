import bcrypt from 'bcrypt';
import UserModel from './user.model.js';
import PocketMoneyModel from '../pocketMoney/pocketMoney.model.js';
import LentMoneyModel from '../lentMoney/lentMoney.model.js';
import ActiveSessionModel from '../session/session.model.js';
import ExpenseModel from '../expense/expense.model.js';
import DeletedUserModel from './deletedUser.model.js';
import { ApiError } from '../../shared/lib/ApiError.js';
import { sha256 } from '../../shared/lib/hash.js';
import { uploadOnCloudinary } from '../../shared/lib/cloudinary.js';
import { sendMessageToUser } from '../../shared/email/email.service.js';
import { logger } from '../../shared/lib/logger.js';

// Whitelist of fields the SPA needs. Adding a User field doesn't leak it
// to /me until you opt-in here.
const ME_FIELDS = [
  '_id',
  'username',
  'name',
  'email',
  'avatar',
  'isVerified',
  'currentPocketMoney',
  'profession',
  'dob',
  'instagramLink',
  'facebookLink',
  'createdAt',
  'lastLogin',
];

function toMeDto(user, currentSession) {
  const dto = {};
  for (const k of ME_FIELDS) dto[k] = user[k];
  dto.currentSession = currentSession ? [currentSession] : [];
  return dto;
}

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
  const [user, currentSession] = await Promise.all([
    UserModel.findById(userId).select('-password').lean(),
    ActiveSessionModel.findOne({ user: userId, tokenHash: sha256(currentToken) })
      .select('-tokenHash')
      .lean(),
  ]);

  if (!user) throw new ApiError(404, 'User not found');
  return toMeDto(user, currentSession);
}

export async function updateProfile(userId, body) {
  const { name, dob, currentPassword, newPassword, instagramLink, facebookLink, profession } = body;

  const updates = {};
  if (name) updates.name = name;
  if (dob === '') updates.dob = null;
  else if (dob instanceof Date) updates.dob = dob;
  if (instagramLink !== undefined) updates.instagramLink = instagramLink;
  if (facebookLink !== undefined) updates.facebookLink = facebookLink;
  if (profession !== undefined) updates.profession = profession;

  if (newPassword) {
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

  sendMessageToUser(
    username,
    'DELETE_ACCOUNT',
    email,
    'Budgetter - Account Deletion Confirmation',
    '',
  ).catch((err) => logger.error({ err, email }, 'delete-account email failed'));
}

export async function isVerified(userId) {
  const u = await UserModel.findById(userId).select('isVerified').lean();
  return !!u?.isVerified;
}

// Atomic $inc — race-free under concurrent expense/pocket-money writes.
export async function adjustBalance(userId, delta) {
  const updated = await UserModel.findByIdAndUpdate(
    userId,
    { $inc: { currentPocketMoney: Number(delta) } },
    { new: true, projection: { currentPocketMoney: 1 } },
  );
  if (!updated) throw new ApiError(404, 'User not found');
  return updated.currentPocketMoney;
}
