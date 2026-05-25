import bcrypt from 'bcrypt';
import { StatusCodes } from 'http-status-codes';
import UserModel, { type IUser } from './user.model.js';
import PocketMoneyModel from '../pocketMoney/pocketMoney.model.js';
import LentMoneyModel from '../lentMoney/lentMoney.model.js';
import ActiveSessionModel from '../session/session.model.js';
import ExpenseModel from '../expense/expense.model.js';
import DeletedUserModel from './deletedUser.model.js';
import { ApiError } from '../../shared/lib/ApiError.js';
import { sha256 } from '../../shared/lib/hash.js';
import { uploadBufferToCloudinary } from '../../shared/lib/cloudinary.js';
import { sendMessageToUser } from '../../shared/email/email.service.js';
import { logger } from '../../shared/lib/logger.js';
import type { UpdateProfileInput } from './user.validator.js';

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
] as const;

type MeField = (typeof ME_FIELDS)[number];
type MeDto = Partial<Record<MeField, unknown>> & { currentSession: unknown[] };

function toMeDto(user: Record<string, unknown>, currentSession: unknown): MeDto {
  const dto: MeDto = { currentSession: currentSession ? [currentSession] : [] };
  for (const k of ME_FIELDS) (dto as Record<string, unknown>)[k] = user[k];
  return dto;
}

export async function generateUniqueUsername(name: string): Promise<string> {
  const base = name.toLowerCase().replace(/\s+/g, '');
  let username = base;
  let count = 1;
  while (await UserModel.findOne({ username })) {
    username = `${base}${count++}`;
  }
  return username;
}

export async function getMe(userId: string, currentToken: string): Promise<MeDto> {
  const [user, currentSession] = await Promise.all([
    UserModel.findById(userId).select('-password').lean(),
    ActiveSessionModel.findOne({ user: userId, tokenHash: sha256(currentToken) })
      .select('-tokenHash')
      .lean(),
  ]);

  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  return toMeDto(user as unknown as Record<string, unknown>, currentSession);
}

export async function updateProfile(userId: string, body: UpdateProfileInput) {
  const { name, dob, currentPassword, newPassword, instagramLink, facebookLink, profession } = body;

  const updates: Partial<IUser> = {};
  if (name) updates.name = name;
  if (dob === '') updates.dob = null;
  else if (dob instanceof Date) updates.dob = dob;
  if (instagramLink !== undefined) updates.instagramLink = instagramLink;
  if (facebookLink !== undefined) updates.facebookLink = facebookLink;
  if (profession !== undefined) updates.profession = profession;

  if (newPassword) {
    const user = await UserModel.findById(userId).select('+password');
    if (!user?.password)
      throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'User password not set.');
    const ok = await bcrypt.compare(currentPassword ?? '', user.password);
    if (!ok) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Current password is incorrect.');
    updates.password = await bcrypt.hash(newPassword, 10);
  }

  const updated = await UserModel.findByIdAndUpdate(
    userId,
    { $set: updates },
    { new: true },
  ).select('-password');
  if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  return updated;
}

export async function updateAvatar(userId: string, fileBuffer: Buffer | undefined) {
  if (!fileBuffer) throw new ApiError(StatusCodes.BAD_REQUEST, 'Avatar file is required');

  const uploaded = await uploadBufferToCloudinary(fileBuffer, { folder: 'budgetter/avatars' });
  if (!uploaded?.secure_url)
    throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Failed to upload avatar');

  const updated = await UserModel.findByIdAndUpdate(
    userId,
    { $set: { avatar: uploaded.secure_url } },
    { new: true },
  ).select('avatar');
  if (!updated) throw new ApiError(StatusCodes.INTERNAL_SERVER_ERROR, 'Avatar not updated');
  return updated;
}

export async function deleteAccount(userId: string, providedPassword: string): Promise<void> {
  const user = await UserModel.findById(userId).select('+password');
  if (!user) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');

  const ok = await user.isPasswordMatch(providedPassword);
  if (!ok) throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid password');

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

export async function isVerified(userId: string): Promise<boolean> {
  const u = await UserModel.findById(userId).select('isVerified').lean();
  return !!u?.isVerified;
}

// Atomic $inc — race-free under concurrent expense/pocket-money writes.
export async function adjustBalance(userId: string, delta: number): Promise<number> {
  const updated = await UserModel.findByIdAndUpdate(
    userId,
    { $inc: { currentPocketMoney: Number(delta) } },
    { new: true, projection: { currentPocketMoney: 1 } },
  );
  if (!updated) throw new ApiError(StatusCodes.NOT_FOUND, 'User not found');
  return updated.currentPocketMoney;
}
