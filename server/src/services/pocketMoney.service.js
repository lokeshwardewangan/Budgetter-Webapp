import PocketMoneyModel from '../models/pocketMoney.model.js';
import { ApiError } from '../utils/ApiError.js';
import { adjustBalance } from './user.service.js';

export async function addEntry(userId, { date, amount, source }) {
  if (!date || !amount || !source) {
    throw new ApiError(400, 'date, amount and source are required');
  }
  const numeric = parseFloat(amount);
  if (Number.isNaN(numeric)) throw new ApiError(400, 'amount must be numeric');

  const entry = await PocketMoneyModel.create({
    user: userId,
    date,
    amount: amount.toString(),
    source,
  });
  const currentPocketMoney = await adjustBalance(userId, numeric);
  return { entry, currentPocketMoney };
}

export async function listEntries(userId) {
  return PocketMoneyModel.find({ user: userId }).sort({ createdAt: -1 }).lean();
}
