import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import * as Sentry from '@sentry/react';
import { useMe } from '@/features/user/hooks';

export const useSentryIntegration = () => {
  const { data: user } = useMe();
  const location = useLocation();

  // 1. User Identification
  useEffect(() => {
    if (user?._id) {
      Sentry.setUser({
        id: user._id,
        email: user.email,
        username: user.username,
        ip_address: '{{auto}}',
      });
      Sentry.setTag('user_role', user.profession || 'unknown');
      Sentry.setTag('account_verified', String(user.isVerified));
    } else {
      Sentry.setUser(null);
      Sentry.setTag('user_role', 'guest');
    }
  }, [user]);

  // 2. Breadcrumbs for Navigation
  useEffect(() => {
    Sentry.addBreadcrumb({
      category: 'navigation',
      message: `Navigated to ${location.pathname}`,
      level: 'info',
      data: {
        path: location.pathname,
        search: location.search,
        hash: location.hash,
      },
    });
  }, [location]);

  useEffect(() => {
    Sentry.setContext('environment', {
      mode: import.meta.env.MODE,
      platform: navigator.platform,
      userAgent: navigator.userAgent,
    });
  }, []);
};
