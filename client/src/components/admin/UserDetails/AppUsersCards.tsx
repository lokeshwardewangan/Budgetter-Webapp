import React from 'react';
import UserCard from './Cards/UserCard';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { GetAppUsersDetails } from '@/services/adminAccess';
import { User } from '@/types/api/admin/reports/userReports';
import { useMe } from '@/features/user/hooks';

const AppUsersCards: React.FC = () => {
  const { data: user } = useMe();

  // get all app users
  const { data } = useQuery({
    queryKey: ['appusers'],
    queryFn: () => GetAppUsersDetails(),
  });

  return (
    <>
      <div className="dashboard_page_ flex w-full flex-col items-start justify-start gap-5">
        <div className="heading_dashboard_page flex w-full items-start justify-start">
          <h3 className="text-left text-lg font-semibold">
            {user && user?.name && (
              <>
                {' '}
                <span className="font-bold text-text_heading_light dark:text-text_primary_dark">
                  Welcome! {user.name} [Admin]
                </span>
              </>
            )}{' '}
          </h3>
        </div>
        <div className="relative w-full max-w-xs">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transform text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search..."
            className="w-full border-cyan-300 pl-9 shadow-none dark:border-slate-700"
          />
        </div>
        <div className="users_cards_container user_cards_section grid h-full w-full grid-cols-12 gap-6 rounded-md">
          {data?.data?.map((user: User, index: number) => (
            <React.Fragment key={index}>
              <UserCard user={user} />
            </React.Fragment>
          ))}
        </div>
      </div>
    </>
  );
};

export default AppUsersCards;
