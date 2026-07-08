export type CategoryWiseExpensesData = Record<string, number>;

export interface TotalExpensesAndAddedMoneyInMonthResType {
  statusCode: number;
  data: {
    totalExpenses: number;
    totalAddedMoney: number;
    lastTotalExpenses: number;
    totalLentMoney: number;
    categoryWiseExpensesData: CategoryWiseExpensesData;
  };
  message: string;
  success: boolean;
}
