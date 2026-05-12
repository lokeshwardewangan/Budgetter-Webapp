import { apiURL } from '@/lib/http';
import { endpoints } from '@/shared/api/endpoints';
import type { ApiResponse } from '@/shared/api/types';
import type { PocketMoneyEntry } from '@/types/api/auth/auth';

export type AddPocketMoneyInput = {
  date: string;
  amount: number;
  source: string;
};

export type AddPocketMoneyResult = {
  entry: PocketMoneyEntry;
  currentPocketMoney: string;
};

export async function addPocketMoney(
  input: AddPocketMoneyInput
): Promise<ApiResponse<AddPocketMoneyResult>> {
  const { data } = await apiURL.post<ApiResponse<AddPocketMoneyResult>>(
    endpoints.pocketMoney.root,
    { ...input, amount: input.amount.toString() }
  );
  return data;
}

export async function getPocketMoneyHistory(): Promise<
  ApiResponse<PocketMoneyEntry[]>
> {
  const { data } = await apiURL.get<ApiResponse<PocketMoneyEntry[]>>(
    endpoints.pocketMoney.root
  );
  return data;
}
