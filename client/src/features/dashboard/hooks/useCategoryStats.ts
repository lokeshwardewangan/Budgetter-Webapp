import { useMemo } from 'react';
import { getMonthInNumber } from '@/utils/date/date';
import { useAllExpenses } from '@/features/expenses/hooks';
import type { ExpenseEntry, ExpenseProduct } from '@/types/api/expenses/expenses';

export type CategoryStats = {
  category: string;
  totalSpent: number;
  expensePercent: number;
  transactionCount: number;
  avgExpense: number;
  maxExpense: number;
  minExpense: number;
};

// Per-category stats for the dashboard insights table. Sourced from the
// useAllExpenses() query (no longer reads Redux). The data fetch is shared
// with the timeline chart so this doesn't trigger a second request.
export function useCategoryStats(
  filterMonthValue: string,
  filterYearValue: string,
): CategoryStats[] {
  const { data: allExpenses = [] } = useAllExpenses();

  return useMemo(() => {
    if (!filterMonthValue || !filterYearValue) return [];
    const monthNum = getMonthInNumber(filterMonthValue);

    const products = filterProductsByMonthYear(allExpenses, monthNum, filterYearValue);
    if (products.length === 0) return [];

    const byCategory = new Map<string, number[]>();
    for (const p of products) {
      const list = byCategory.get(p.category) ?? [];
      list.push(p.price);
      byCategory.set(p.category, list);
    }

    const totalSpentAll = products.reduce((acc, p) => acc + p.price, 0);

    return Array.from(byCategory.entries()).map(([category, prices]) => {
      const totalSpent = prices.reduce((a, b) => a + b, 0);
      const transactionCount = prices.length;
      return {
        category,
        totalSpent,
        expensePercent: parseFloat(((totalSpent / totalSpentAll) * 100).toFixed(2)),
        transactionCount,
        avgExpense: totalSpent / transactionCount,
        maxExpense: Math.max(...prices),
        minExpense: Math.min(...prices),
      };
    });
  }, [allExpenses, filterMonthValue, filterYearValue]);
}

// Pure helper to drill into a category for the "View Expenses" dialog. NOT a
// hook — receives the already-fetched expenses and category as inputs so it
// can be called from inside table-cell renderers without violating the
// Rules of Hooks (the legacy `getFullExpensesList` did).
export function getFullExpensesList(
  allExpenses: ExpenseEntry[],
  categoryName: string,
  filterMonthValue: string,
  filterYearValue: string,
) {
  const monthNum = getMonthInNumber(filterMonthValue);
  return allExpenses
    .filter((entry) => {
      const [, m, y] = entry.date.split('-');
      return m === monthNum && y === filterYearValue;
    })
    .flatMap((entry) =>
      entry.products.map((p) => ({ ...p, date: entry.date })),
    )
    .filter((p) => p.category === categoryName);
}

function filterProductsByMonthYear(
  allExpenses: ExpenseEntry[],
  monthNum: string,
  year: string,
): ExpenseProduct[] {
  return allExpenses
    .filter((entry) => {
      const [, m, y] = entry.date.split('-');
      return m === monthNum && y === year;
    })
    .flatMap((entry) => entry.products);
}
