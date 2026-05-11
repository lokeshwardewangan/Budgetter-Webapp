import { Outlet } from 'react-router-dom';
import SideNavbar from '@/features/layout/sidebar/SideNavbar';
import TopHeader from '@/features/layout/header/TopHeader';
import DashboardLoader from './Loader/DashboardLoader';
import TopHeaderLoader from './Loader/TopHeaderLoader';
import { userSidenavbarList } from '@/data/UserSideNavbarList';
import { useMe } from '@/features/user/hooks';
import { useSidebar } from '@/shared/contexts/SidebarContext';
import { useIsMobile } from '@/shared/hooks/useMediaQuery';

export default function UserLayout() {
  const { isOpen: isSideNavbarOpen } = useSidebar();
  const isMobile = useIsMobile();
  const { data: user } = useMe();

  return (
    <>
      <SideNavbar userSidenavbarList={userSidenavbarList} />
      <div
        className={`dashboard_layout_container absolute right-0 top-0 flex flex-col ${isSideNavbarOpen && !isMobile && 'dashboard_layout_container_large_screen_open'} ${!isSideNavbarOpen && !isMobile && 'dashboard_layout_container_large_screen_close'} ${isMobile && 'dashboard_layout_container_small_screen_close'} `}
      >
        {user?._id ? <TopHeader /> : <TopHeaderLoader />}
        <div className="flex flex-col items-center justify-start gap-5 px-6 py-5">
          {user?._id ? <Outlet /> : <DashboardLoader />}
        </div>
      </div>
    </>
  );
}
