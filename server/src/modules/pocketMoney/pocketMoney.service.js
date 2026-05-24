import PocketMoneyModel from './pocketMoney.model.js';
import { adjustBalance } from '../user/user.service.js';

export async function addEntry(userId, { date, amount, source }) {
  const entry = await PocketMoneyModel.create({ user: userId, date, amount, source });
  const currentPocketMoney = await adjustBalance(userId, amount);
  return { entry, currentPocketMoney };
}

export async function listEntries(userId) {
  return PocketMoneyModel.find({ user: userId }).sort({ createdAt: -1 }).lean();
}
