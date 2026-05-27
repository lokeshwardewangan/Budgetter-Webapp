import type { CSSProperties } from 'react';
import { Outlet } from 'react-router-dom';
import SideNavbar from '@/features/layout/sidebar/SideNavbar';
import TopHeader from '@/features/layout/header/TopHeader';
import DashboardLoader from './Loader/DashboardLoader';
import TopHeaderLoader from './Loader/TopHeaderLoader';
import { userSidenavbarList } from '@/data/UserSideNavbarList';
import { useMe } from '@/features/user/hooks';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import { TourProvider } from '@/features/tour';
import { useIsMobile } from '@/shared/hooks/useMediaQuery';

export default function UserLayout() {
  const isMobile = useIsMobile();
  const { data: user } = useMe();

  return (
    <SidebarProvider
      defaultOpen={!isMobile}
      style={
        {
          '--sidebar-width': '13rem',
          '--sidebar-width-icon': '4.25rem',
        } as CSSProperties
      }
    >
      <TourProvider>
        <SideNavbar userSidenavbarList={userSidenavbarList} />
        <SidebarInset className="flex flex-col bg-bg_secondary_light dark:bg-bg_secondary_dark">
          {user?._id ? <TopHeader /> : <TopHeaderLoader />}
          <div className="flex flex-col items-center justify-start gap-5 px-6 py-5">
            {user?._id ? <Outlet /> : <DashboardLoader />}
          </div>
        </SidebarInset>
      </TourProvider>
    </SidebarProvider>
  );
}
