import { useMe } from '@/features/user/hooks';

export default function CurrentBalanceCard() {
  const { data: user } = useMe();
  const numeric = Number(user?.currentPocketMoney) || 0;

  return (
    <div className="summary_boxes_outer flex w-full flex-wrap items-center justify-start gap-7 lg:justify-start">
      <div
        id="current_pocket_money_section"
        className="flex w-full max-w-full flex-col flex-wrap items-center justify-center gap-0 rounded-[10px] bg-gradient-to-br from-[#a376fc] to-[#f96f9b] p-3 hover:bg-gradient-to-tl md:max-w-[14rem]"
      >
        <p className="text-center text-lg font-semibold text-white">Current Balance</p>
        <p className="text-center text-2xl font-bold text-white">{numeric}</p>
      </div>
    </div>
  );
}
