import PocketMoneyModel from './pocketMoney.model.js';
import { adjustBalance } from '../user/user.service.js';

interface AddEntryInput {
  date: Date;
  amount: number;
  source: string;
}

export async function addEntry(userId: string, { date, amount, source }: AddEntryInput) {
  const entry = await PocketMoneyModel.create({ user: userId, date, amount, source });
  const currentPocketMoney = await adjustBalance(userId, amount);
  return { entry, currentPocketMoney };
}

export async function listEntries(userId: string) {
  return PocketMoneyModel.find({ user: userId }).sort({ createdAt: -1 }).lean();
}
