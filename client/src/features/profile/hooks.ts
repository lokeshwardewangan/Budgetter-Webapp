import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import Cookies from 'universal-cookie';
import { qk } from '@/shared/lib/queryKeys';
import { deleteAccount, updateAvatar, updateProfile } from './api';

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.me }),
  });
}

export function useUpdateAvatar() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: updateAvatar,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: qk.me }),
  });
}

export function useDeleteAccount() {
  const navigate = useNavigate();
  const cookie = new Cookies();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: deleteAccount,
    onSuccess: () => {
      cookie.remove('accessToken', { path: '/' });
      queryClient.clear();
      setTimeout(() => navigate('/'), 1500);
    },
  });
}
