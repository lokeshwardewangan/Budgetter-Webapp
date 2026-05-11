import PocketMoneyModel from '../models/pocketMoney.model.js';
import { adjustBalance } from './user.service.js';

export async function addEntry(userId, { date, amount, source }) {
  // `amount` arrives as a positive Number from the validator's coercion.
  const entry = await PocketMoneyModel.create({
    user: userId,
    date,
    amount: amount.toString(),
    source,
  });
  const currentPocketMoney = await adjustBalance(userId, amount);
  return { entry, currentPocketMoney };
}

export async function listEntries(userId) {
  return PocketMoneyModel.find({ user: userId }).sort({ createdAt: -1 }).lean();
}
