import mongoose, { Schema } from 'mongoose';

export const EXPENSE_CATEGORIES = [
  'Groceries',
  'Housing & Utilities',
  'Medical',
  'Food',
  'Personal',
  'Educational',
  'Transportation',
  'Miscellaneous',
];

const ExpenseSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: Date,
      required: true,
      default: Date.now,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    category: {
      type: String,
      required: true,
      enum: {
        values: EXPENSE_CATEGORIES,
        message: '{VALUE} is not a valid expense category',
      },
    },
    label: {
      type: String,
      default: null,
    },
  },
  { timestamps: true },
);

ExpenseSchema.index({ user: 1, date: -1 });
ExpenseSchema.index({ user: 1, category: 1, date: -1 });
ExpenseSchema.index({ user: 1, createdAt: -1 });

const Expense = mongoose.model('Expense', ExpenseSchema);
export default Expense;
