import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { useSentryIntegration } from '@/hooks/useSentryIntegration';
import { useTheme } from '@/shared/contexts/ThemeContext';
import { getPageTitle } from '@/utils/utility';

export default function MainLayout() {
  const location = useLocation();
  const { isDarkMode } = useTheme();
  useSentryIntegration();

  useEffect(() => {
    const isLanding = location.pathname === '/';
    document.body.classList.toggle('dark', isDarkMode && !isLanding);
  }, [isDarkMode, location.pathname]);

  useEffect(() => {
    document.title = getPageTitle();
  }, [location.pathname]);

  return (
    <>
      <div id="main_layout" className="h-full w-full dark:bg-slate-900">
        <Outlet />
      </div>
      <Toaster />
    </>
  );
}
