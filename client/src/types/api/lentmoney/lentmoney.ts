import type { LentMoneyEntry } from '@/types/api/auth/auth';

export type LentMoneyItem = LentMoneyEntry;

export interface AddLentMoneyResType {
  statusCode: number;
  data: {
    entry: LentMoneyEntry;
    currentPocketMoney: string;
    totalLentMoney: number;
  };
  message: string;
  success: boolean;
}

export interface ReceivedLentMoneyResType {
  statusCode: number;
  data: {
    entry: LentMoneyEntry;
    currentPocketMoney: string;
  };
  message: string;
  success: boolean;
}

export interface AllLentMoneyResType {
  statusCode: number;
  data: LentMoneyEntry[];
  message: string;
  success: boolean;
}
