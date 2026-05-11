import AddLentMoneyForm from '@/features/lentMoney/components/AddLentMoneyForm';
import LentMoneyHistoryTable from '@/features/lentMoney/components/LentMoneyHistoryTable';
import CurrentBalanceCard from '@/features/pocketMoney/components/CurrentBalanceCard';

export default function AddLentMoney() {
  return (
    <>
      <CurrentBalanceCard />
      <AddLentMoneyForm />
      <LentMoneyHistoryTable />
    </>
  );
}
