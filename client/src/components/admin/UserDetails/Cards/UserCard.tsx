import { User } from '@/types/api/admin/reports/userReports';
import IndividualUserDetails from '../IndividualUserDetails';

interface UserCardProps {
  user: User;
}

const UserCard: React.FC<UserCardProps> = ({ user }) => {
  const { avatar, username, name, email, currentPocketMoney, isVerified } = user;

  return (
    <div className="user_card_container col-span-12 flex flex-col items-center gap-2 rounded-2xl border-[#6a718533] bg-white p-5 dark:border dark:bg-bg_primary_dark md:col-span-12 lg:col-span-6 2xl:col-span-3">
      <div className="user_detail flex flex-col items-center justify-center gap-3">
        <div className="user_profiles from-theme-default relative inline-block rounded-full bg-gradient-to-br to-transparent p-[2px]">
          <div className="relative rounded-full bg-white p-[5px] dark:bg-[#262932]">
            <img
              alt="User's profile"
              loading="lazy"
              width="68"
              height="68"
              decoding="async"
              className="h-[68px] rounded-full"
              src={
                avatar ||
                'https://res.cloudinary.com/budgettercloud/image/upload/v1728999013/u1v1qmzpj91vdhd3cimu.webp'
              }
              crossOrigin="anonymous"
              style={{ color: 'transparent' }}
            />
          </div>
        </div>
        <div className="details flex flex-col items-center gap-0">
          <span className="text-sm font-medium text-black">@{username}</span>
          <span className="text-sm font-medium text-[#3A3A3A] dark:text-white">
            {name}
          </span>
          <span className="text-sm text-[#3A3A3A] dark:font-medium dark:text-white">
            {email}
          </span>
        </div>
      </div>
      <ul className="flex items-center justify-center">
        <li className="relative flex flex-col items-center gap-0 px-4 py-0">
          <h5 className="text-base font-semibold dark:text-white">
            {currentPocketMoney}
          </h5>
          <span className="flex flex-col items-center justify-center text-center text-sm font-medium leading-4 text-[#888888] dark:text-white">
            <span>Pocket</span>
            <span>Money</span>
          </span>
          <div className="absolute right-0 top-2/4 h-5 w-px -translate-y-1/2 bg-gray-300"></div>
        </li>
        <li className="relative flex flex-col items-center gap-0 px-4 py-0">
          <h5 className="text-base font-semibold dark:text-white">
            {Number(isVerified)}
          </h5>
          <span className="flex flex-col items-center justify-center text-center text-sm font-medium leading-4 text-[#888888] dark:text-white">
            <span>Verified</span>
            <span>User</span>
          </span>
          <div className="absolute right-0 top-2/4 h-5 w-px -translate-y-1/2 bg-gray-300"></div>
        </li>
        <li className="flex flex-col items-center gap-0 px-4 py-0">
          <h5 className="text-base font-semibold dark:text-white">—</h5>
          <span className="flex flex-col items-center justify-center text-center text-sm font-medium leading-4 text-[#888888] dark:text-white">
            <span>Total</span>
            <span>Lent</span>
          </span>
        </li>
      </ul>
      <IndividualUserDetails user={user} />
    </div>
  );
};

export default UserCard;
