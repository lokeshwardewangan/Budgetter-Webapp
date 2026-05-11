import { useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Cookies from 'universal-cookie';
import { useSentryIntegration } from '@/hooks/useSentryIntegration';
import { useMe } from '@/features/user/hooks';
import {
  navigateToLandingPage,
  navigateToUserPage,
} from '@/utils/navigate/NavigateRightPath';
import { getPageTitle } from '@/utils/utility';

export default function MainLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  useSentryIntegration();
  const cookie = new Cookies();

  // Trigger the /me query early so it's primed by the time pages mount.
  // Theme + sidebar state now live in their own context providers.
  const { data } = useMe();

  useEffect(() => {
    const accessToken = cookie.get('accessToken');
    if (!accessToken) {
      navigate(navigateToLandingPage());
      return;
    }
    navigate(navigateToUserPage());
  }, [location.pathname]);

  useEffect(() => {
    if (data) navigate(navigateToUserPage());
  }, [data]);

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
