import { useEffect, useRef, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import SideNavbar from '@/features/layout/sidebar/SideNavbar';
import TopHeader from '@/features/layout/header/TopHeader';
import { adminSidenavbarList } from '@/data/AdminSidebarList';
import { useSidebar } from '@/shared/contexts/SidebarContext';
import { useIsMobile } from '@/shared/hooks/useMediaQuery';

const adminPassword = import.meta.env.VITE_BUDGETTER_ADMIN_PASSWORD;

export default function AdminLayout() {
  const { isOpen: isSideNavbarOpen } = useSidebar();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const hasPrompted = useRef(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    if (hasPrompted.current) return;
    const password = prompt('Admin Password ???');
    const isAuthenticated = password === adminPassword;
    setIsAdminAuthenticated(isAuthenticated);
    hasPrompted.current = true;
    if (!isAuthenticated) navigate('/user/dashboard');
  }, [navigate]);

  return (
    <div
      className={`h-full w-full ${isAdminAuthenticated ? 'block' : 'hidden'}`}
    >
      <SideNavbar userSidenavbarList={adminSidenavbarList} />
      <div
        className={`dashboard_layout_container absolute right-0 top-0 flex flex-col ${isSideNavbarOpen && !isMobile && 'dashboard_layout_container_large_screen_open'} ${!isSideNavbarOpen && !isMobile && 'dashboard_layout_container_large_screen_close'} ${isMobile && 'dashboard_layout_container_small_screen_close'} `}
      >
        <TopHeader />
        <div className="flex w-full flex-col items-center justify-start gap-5 px-6 py-5">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
