import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { googleLogout } from '@react-oauth/google';
import Cookies from 'universal-cookie';
import { qk } from '@/shared/lib/queryKeys';
import {
  CheckUserAccountVerified,
  LoginUser,
  registerUser,
  SignupWithGoogle,
  UserLogout,
  SendResetLinkToUserEmail,
  ResetUserPassword,
} from './api';
import type { AuthResType } from '@/types/api/auth/auth';

// Post-auth side effects: drop the token in a cookie, seed the /me query
// cache so the rest of the app reads "who am I" instantly, then navigate.
function useHandleAuthSuccess() {
  const cookie = new Cookies();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return (res: AuthResType, redirectTo = '/user/dashboard') => {
    const { user, token } = res.data;

    cookie.set('accessToken', token, { path: '/' });

    // Seed `/me` cache so consumers don't have to wait for a fresh fetch.
    queryClient.setQueryData(qk.me, {
      statusCode: 200,
      success: true,
      message: 'ok',
      data: user,
    });

    if (localStorage.getItem('isDarkMode') === 'true') {
      document.body.classList.toggle('dark', true);
    }

    navigate(redirectTo);
  };
}

export function useLogin() {
  const onAuthSuccess = useHandleAuthSuccess();
  return useMutation({ mutationFn: LoginUser, onSuccess: onAuthSuccess });
}

export function useSignup() {
  const onAuthSuccess = useHandleAuthSuccess();
  return useMutation({ mutationFn: registerUser, onSuccess: onAuthSuccess });
}

export function useGoogleSignIn() {
  const onAuthSuccess = useHandleAuthSuccess();
  return useMutation({ mutationFn: SignupWithGoogle, onSuccess: onAuthSuccess });
}

export function useForgotPassword() {
  return useMutation({ mutationFn: SendResetLinkToUserEmail });
}

export function useResetPassword() {
  const navigate = useNavigate();
  return useMutation({
    mutationFn: ResetUserPassword,
    onSuccess: () => navigate('/login'),
  });
}

export function useMeVerified() {
  return useQuery({
    queryKey: qk.meVerified,
    queryFn: CheckUserAccountVerified,
    select: (res) => res.data,
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const cookie = new Cookies();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: UserLogout,
    onSuccess: () => {
      googleLogout();
      cookie.remove('accessToken', { path: '/' });
      document.body.classList.remove('dark');
      localStorage.removeItem('hasSeenTour');
      queryClient.clear();
      navigate('/');
    },
  });
}
