import LentMoneyModel from '../models/lentMoney.model.js';
import { ApiError } from '../utils/ApiError.js';
import { adjustBalance } from './user.service.js';

export async function addEntry(userId, { personName, price, date }) {
  // `price` arrives as a positive Number from the validator's coercion.
  const entry = await LentMoneyModel.create({
    user: userId,
    personName,
    price: price.toString(),
    date,
  });

  const currentPocketMoney = await adjustBalance(userId, -price);

  const totals = await LentMoneyModel.aggregate([
    { $match: { user: entry.user, isReceived: false } },
    { $group: { _id: null, total: { $sum: { $toDouble: '$price' } } } },
  ]);
  const totalLentMoney = totals[0]?.total || 0;

  return { entry, currentPocketMoney, totalLentMoney };
}

export async function listEntries(userId) {
  return LentMoneyModel.find({ user: userId }).sort({ createdAt: -1 }).lean();
}

export async function markReceived(userId, lentMoneyId) {
  const entry = await LentMoneyModel.findOne({ _id: lentMoneyId, user: userId });
  if (!entry) throw new ApiError(404, 'Lent money record not found');
  if (entry.isReceived) throw new ApiError(409, 'This lent money has already been received');

  entry.isReceived = true;
  entry.receivedAt = new Date();
  await entry.save();

  const numeric = parseFloat(entry.price) || 0;
  const currentPocketMoney = await adjustBalance(userId, numeric);
  return { entry, currentPocketMoney };
}
