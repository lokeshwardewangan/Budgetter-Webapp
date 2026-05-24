import { useMemo } from 'react';
import { getMonthInNumber } from '@/utils/date/date';
import { useAllExpenses } from '@/features/expenses/hooks';
import type { Expense } from '@/types/api/expenses/expenses';

export type CategoryStats = {
  category: string;
  totalSpent: number;
  expensePercent: number;
  transactionCount: number;
  avgExpense: number;
  maxExpense: number;
  minExpense: number;
};

function inMonthYear(e: Expense, monthNum: string, year: string): boolean {
  const d = new Date(e.date);
  const m = String(d.getUTCMonth() + 1).padStart(2, '0');
  const y = String(d.getUTCFullYear());
  return m === monthNum && y === year;
}

export function useCategoryStats(
  filterMonthValue: string,
  filterYearValue: string
): CategoryStats[] {
  const { data: allExpenses = [] } = useAllExpenses();

  return useMemo(() => {
    if (!filterMonthValue || !filterYearValue) return [];
    const monthNum = getMonthInNumber(filterMonthValue);

    const inRange = allExpenses.filter((e) => inMonthYear(e, monthNum, filterYearValue));
    if (inRange.length === 0) return [];

    const byCategory = new Map<string, number[]>();
    for (const e of inRange) {
      const list = byCategory.get(e.category) ?? [];
      list.push(e.price);
      byCategory.set(e.category, list);
    }

    const totalSpentAll = inRange.reduce((acc, e) => acc + e.price, 0);

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

// Pure helper for the "View Expenses" dialog drill-down.
export function getFullExpensesList(
  allExpenses: Expense[],
  categoryName: string,
  filterMonthValue: string,
  filterYearValue: string
) {
  const monthNum = getMonthInNumber(filterMonthValue);
  return allExpenses
    .filter((e) => inMonthYear(e, monthNum, filterYearValue))
    .filter((e) => e.category === categoryName);
}
