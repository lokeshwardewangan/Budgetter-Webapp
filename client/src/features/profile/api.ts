import axios, { type AxiosRequestConfig } from 'axios';
import { apiURL } from '@/lib/http';
import { endpoints } from '@/shared/api/endpoints';
import { backendHostURL } from '@/services/api';
import { getCurrentAccessToken } from '@/utils/cookie/CookiesInfo';
import type { ApiResponse } from '@/shared/api/types';

export type UpdateProfileInput = {
  name?: string;
  dob?: string;
  profession?: string;
  instagramLink?: string;
  facebookLink?: string;
  currentPassword?: string;
  newPassword?: string;
};

export type AvatarResponse = { avatar: string };

export async function updateProfile(
  input: UpdateProfileInput,
): Promise<ApiResponse<unknown>> {
  const { data } = await apiURL.patch<ApiResponse<unknown>>(endpoints.users.me, input);
  return data;
}

export async function updateAvatar(formData: FormData): Promise<ApiResponse<AvatarResponse>> {
  // multer expects multipart; the global axios instance hard-codes JSON, so
  // we use a bare axios call here with the same auth header.
  const config: AxiosRequestConfig = {
    headers: { Authorization: `Bearer ${getCurrentAccessToken()}` },
  };
  const { data } = await axios.patch<ApiResponse<AvatarResponse>>(
    `${backendHostURL}${endpoints.users.avatar}`,
    formData,
    config,
  );
  return data;
}

export async function deleteAccount(password: string): Promise<ApiResponse<null>> {
  const { data } = await apiURL.delete<ApiResponse<null>>(endpoints.users.me, {
    data: { password },
  });
  return data;
}
