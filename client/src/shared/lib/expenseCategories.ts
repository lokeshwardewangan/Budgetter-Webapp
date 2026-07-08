// Single source of truth for expense categories on the client.
// Server-side counterpart: server/src/modules/expense/expense.model.ts EXPENSE_CATEGORIES.
// Adding/renaming a category here must be done in lockstep with the server enum.

export const expenseCategories = [
  {
    name: 'Groceries',
    hex: 0xff6347,
    gradient: 'linear-gradient(to right, #FF6347, #FF4500)',
    stops: [0xff6347, 0xff4500],
    textClass: 'text-green-600 dark:text-green-400',
  },
  {
    name: 'Housing & Utilities',
    hex: 0xffa500,
    gradient: 'linear-gradient(to right, #FFA500, #FF8C00)',
    stops: [0xffa500, 0xff8c00],
    textClass: 'text-blue-600 dark:text-blue-400',
  },
  {
    name: 'Medical',
    hex: 0x4682b4,
    gradient: 'linear-gradient(to right, #4682B4, #5F9EA0)',
    stops: [0x4682b4, 0x5f9ea0],
    textClass: 'text-red-600 dark:text-red-400',
  },
  {
    name: 'Food',
    hex: 0x6a5acd,
    gradient: 'linear-gradient(to right, #6A5ACD, #483D8B)',
    stops: [0x6a5acd, 0x483d8b],
    textClass: 'text-yellow-600 dark:text-yellow-400',
  },
  {
    name: 'Personal',
    hex: 0x32cd32,
    gradient: 'linear-gradient(to right, #32CD32, #228B22)',
    stops: [0x32cd32, 0x228b22],
    textClass: 'text-pink-600 dark:text-pink-400',
  },
  {
    name: 'Educational',
    hex: 0xffd700,
    gradient: 'linear-gradient(to right, #FFD700, #FFC200)',
    stops: [0xffd700, 0xffc200],
    textClass: 'text-indigo-600 dark:text-indigo-400',
  },
  {
    name: 'Investment',
    hex: 0x10b981,
    gradient: 'linear-gradient(to right, #10B981, #059669)',
    stops: [0x10b981, 0x059669],
    textClass: 'text-emerald-600 dark:text-emerald-400',
  },
  {
    name: 'Transportation',
    hex: 0xff1493,
    gradient: 'linear-gradient(to right, #FF1493, #C71585)',
    stops: [0xff1493, 0xc71585],
    textClass: 'text-purple-600 dark:text-purple-400',
  },
  {
    name: 'Miscellaneous',
    hex: 0x8a2be2,
    gradient: 'linear-gradient(to right, #8A2BE2, #6A0DAD)',
    stops: [0x8a2be2, 0x6a0dad],
    textClass: 'text-gray-600 dark:text-gray-400',
  },
] as const;

export type ExpenseCategoryName = (typeof expenseCategories)[number]['name'];

export const expenseCategoryNames = expenseCategories.map(
  (c) => c.name
) as readonly ExpenseCategoryName[];

export const categoryGradientStops: Record<string, readonly number[]> =
  Object.fromEntries(expenseCategories.map((c) => [c.name, c.stops]));

export const categoryColorMap: Record<string, string> = Object.fromEntries(
  expenseCategories.map((c) => [c.name, c.textClass])
);

export function getCategoryKey(category: string): string {
  return (
    category.replace(/\s+/g, '_').replace(/[^a-zA-Z0-9_]/g, '') + 'Expenses'
  );
}
