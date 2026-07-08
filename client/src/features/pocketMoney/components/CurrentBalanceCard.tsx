import { useState, useEffect } from 'react';
import { useMe } from '@/features/user/hooks';

export default function CurrentBalanceCard() {
  const { data: user } = useMe();
  const numeric = Number(user?.currentPocketMoney) || 0;

  const [isHidden, setIsHidden] = useState(true);

  // Read privacy setting on mount
  useEffect(() => {
    const saved = localStorage.getItem('pocket_money_privacy');
    setIsHidden(saved !== 'visible');
  }, []);

  return (
    <div className="summary_boxes_outer flex w-full flex-wrap items-center justify-start gap-7 lg:justify-start">
      <div
        id="current_pocket_money_section"
        className="relative flex w-full max-w-full flex-col flex-wrap items-center justify-center gap-1 rounded-[10px] bg-gradient-to-br from-[#a376fc] to-[#f96f9b] p-4 hover:bg-gradient-to-tl md:max-w-[14rem]"
      >
        <p className="select-none text-center text-lg font-semibold text-white">
          Current Balance
        </p>
        <p
          className={`text-center text-2xl font-bold text-white transition-all duration-500 ease-in-out ${
            isHidden
              ? 'scale-[0.98] select-none opacity-70 blur-[5px]'
              : 'scale-100 opacity-100 blur-none'
          }`}
        >
          ₹{numeric}
        </p>
      </div>
    </div>
  );
}
