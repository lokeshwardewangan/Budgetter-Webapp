// Flat expense row — one document per line item after the v2 flatten.
export interface Expense {
  _id: string;
  user: string;
  date: string; // ISO 8601 from server
  name: string;
  price: number;
  category: string;
  label: string | null;
  createdAt: string;
  updatedAt: string;
}

// Alias for components that still type-name the product shape.
export type ExpenseProduct = Expense;

export interface ExpensesResType {
  statusCode: number;
  data: Expense[];
  message: string;
  success: boolean;
}

export type TodayExpensesResType = ExpensesResType;
export type AllExpensesResType = ExpensesResType;

export interface AddExpensesResType {
  statusCode: number;
  data: {
    expenses: Expense[];
    currentPocketMoney: number;
    totalDeducted: number;
  } | null;
  message: string;
  success: boolean;
}

export interface EditedExpenseResType {
  statusCode: number;
  data: { expense: Expense; currentPocketMoney: number };
  message: string;
  success: boolean;
}

export interface DeletedExpenseResType {
  statusCode: number;
  data: { currentPocketMoney?: number; refunded: boolean };
  message: string;
  success: boolean;
}

export interface AllExpenseExpenseTableType {
  sno: number;
  name: string;
  price: number;
  label: string | null;
  category: string;
  createdAt: string;
}
