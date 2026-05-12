import { apiURL } from '@/lib/http';
import { endpoints } from '@/shared/api/endpoints';
import type { ApiResponse } from '@/shared/api/types';
import type { CategoryWiseExpensesData } from '@/types/api/reports/reports';

export type MonthlyReportInput = {
  month: string; // "01".."12"
  year: string; // "YYYY"
};

export type MonthlyReportData = {
  totalExpenses: number;
  totalAddedMoney: number;
  lastTotalExpenses: number;
  totalLentMoney: number;
  categoryWiseExpensesData: CategoryWiseExpensesData;
};

export async function getMonthlyReport(
  input: MonthlyReportInput
): Promise<ApiResponse<MonthlyReportData>> {
  const { data } = await apiURL.get<ApiResponse<MonthlyReportData>>(
    endpoints.reports.monthly,
    { params: input }
  );
  return data;
}
