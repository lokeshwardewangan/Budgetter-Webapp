import AddExpenseForm from '@/features/expenses/components/AddExpenseForm';
import TodayExpensesPanel from '@/features/expenses/components/TodayExpensesPanel';
import CurrentBalanceCard from '@/features/pocketMoney/components/CurrentBalanceCard';

export default function AddExpenses() {
  return (
    <>
      <CurrentBalanceCard />
      <AddExpenseForm />
      <TodayExpensesPanel />
    </>
  );
}
