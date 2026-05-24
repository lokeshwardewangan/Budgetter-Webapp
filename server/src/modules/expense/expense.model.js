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

const ProductSchema = new Schema(
  {
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
      required: false,
    },
  },
  { timestamps: true },
);

const ExpensesSchema = new Schema(
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
    products: {
      type: [ProductSchema],
      validate: [(arr) => arr.length > 0, 'Must have at least 1 product'],
    },
  },
  {
    timestamps: true,
  },
);

ExpensesSchema.index({ user: 1, date: 1 });

const Expense = mongoose.model('Expense', ExpensesSchema);
export default Expense;
