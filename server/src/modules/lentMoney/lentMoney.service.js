import { StatusCodes } from 'http-status-codes';
import LentMoneyModel from './lentMoney.model.js';
import { ApiError } from '../../shared/lib/ApiError.js';
import { adjustBalance } from '../user/user.service.js';

export async function addEntry(userId, { personName, price, date }) {
  const entry = await LentMoneyModel.create({ user: userId, personName, price, date });
  const currentPocketMoney = await adjustBalance(userId, -price);

  const totals = await LentMoneyModel.aggregate([
    { $match: { user: entry.user, isReceived: false } },
    { $group: { _id: null, total: { $sum: '$price' } } },
  ]);
  const totalLentMoney = totals[0]?.total || 0;

  return { entry, currentPocketMoney, totalLentMoney };
}

export async function listEntries(userId) {
  return LentMoneyModel.find({ user: userId }).sort({ createdAt: -1 }).lean();
}

export async function markReceived(userId, lentMoneyId) {
  const entry = await LentMoneyModel.findOne({ _id: lentMoneyId, user: userId });
  if (!entry) throw new ApiError(StatusCodes.NOT_FOUND, 'Lent money record not found');
  if (entry.isReceived)
    throw new ApiError(StatusCodes.CONFLICT, 'This lent money has already been received');

  entry.isReceived = true;
  entry.receivedAt = new Date();
  await entry.save();

  const currentPocketMoney = await adjustBalance(userId, entry.price);
  return { entry, currentPocketMoney };
}
