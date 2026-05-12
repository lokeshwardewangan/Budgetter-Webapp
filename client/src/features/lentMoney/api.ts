import { apiURL } from '@/lib/http';
import { endpoints } from '@/shared/api/endpoints';
import type { ApiResponse } from '@/shared/api/types';
import type { LentMoneyEntry } from '@/types/api/auth/auth';

export type AddLentMoneyInput = {
  personName: string;
  price: number;
  date: string;
};

export type AddLentMoneyResult = {
  entry: LentMoneyEntry;
  currentPocketMoney: string;
  totalLentMoney: number;
};

export type MarkReceivedResult = {
  entry: LentMoneyEntry;
  currentPocketMoney: string;
};

export async function addLentMoney(
  input: AddLentMoneyInput
): Promise<ApiResponse<AddLentMoneyResult>> {
  const { data } = await apiURL.post<ApiResponse<AddLentMoneyResult>>(
    endpoints.lentMoney.root,
    { ...input, price: input.price.toString() }
  );
  return data;
}

export async function getLentMoneyHistory(): Promise<
  ApiResponse<LentMoneyEntry[]>
> {
  const { data } = await apiURL.get<ApiResponse<LentMoneyEntry[]>>(
    endpoints.lentMoney.root
  );
  return data;
}

export async function markLentMoneyReceived(
  lentMoneyId: string
): Promise<ApiResponse<MarkReceivedResult>> {
  const { data } = await apiURL.patch<ApiResponse<MarkReceivedResult>>(
    endpoints.lentMoney.receive(lentMoneyId)
  );
  return data;
}
