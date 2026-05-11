import ExpensesByDatePanel from '@/features/expenses/components/ExpensesByDatePanel';
import CurrentBalanceCard from '@/features/pocketMoney/components/CurrentBalanceCard';

export default function ShowExpenses() {
  return (
    <>
      <CurrentBalanceCard />
      <ExpensesByDatePanel />
    </>
  );
}
