import mongoose, { Schema, type Types } from 'mongoose';
import { EXPENSE_CATEGORIES } from '../expense/expense.model.js';

export interface IBudget {
  user: Types.ObjectId;
  category: string; // Valid category from EXPENSE_CATEGORIES or 'Overall'
  limit: number;
  month: number; // 1 - 12
  year: number; // e.g., 2026
  createdAt: Date;
  updatedAt: Date;
}

const BudgetSchema = new Schema<IBudget>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: {
      type: String,
      required: true,
      validate: {
        validator: (val: string) =>
          val === 'Overall' || (EXPENSE_CATEGORIES as unknown as string[]).includes(val),
        message:
          '{VALUE} is not a valid budget category (must be a valid expense category or "Overall")',
      },
    },
    limit: { type: Number, required: true, min: 0 },
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true, min: 2000 },
  },
  { timestamps: true },
);

// Compound index to ensure uniqueness per user + category + month + year
BudgetSchema.index({ user: 1, category: 1, month: 1, year: 1 }, { unique: true });

const Budget = mongoose.model<IBudget>('Budget', BudgetSchema);
export default Budget;
