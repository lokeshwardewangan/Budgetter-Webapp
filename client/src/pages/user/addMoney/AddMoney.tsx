import AddPocketMoneyForm from '@/features/pocketMoney/components/AddPocketMoneyForm';
import CurrentBalanceCard from '@/features/pocketMoney/components/CurrentBalanceCard';
import PocketMoneyHistoryTable from '@/features/pocketMoney/components/PocketMoneyHistoryTable';

export default function AddMoney() {
  return (
    <>
      <CurrentBalanceCard />
      <AddPocketMoneyForm />
      <PocketMoneyHistoryTable />
    </>
  );
}
