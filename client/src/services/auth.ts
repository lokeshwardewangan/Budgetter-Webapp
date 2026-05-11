import Cookies from 'universal-cookie';
import axios, { AxiosRequestConfig } from 'axios';
import { apiURL } from '@/lib/http';
import { endpoints } from '@/shared/api/endpoints';
import { backendHostURL, contactFormServerHostURL } from './api';
import { getCurrentAccessToken } from '@/utils/cookie/CookiesInfo';
import {
  AllSessionsResType,
  AuthResType,
  ChangeAvatarResType,
  CommonNullResType,
  ContactFormResType,
  DeleteUserResType,
  PocketMoneyResType,
  ResetPasswordResType,
  SendPassResetLinkResType,
  UpdateUserDetailsResType,
  UserAccountVerifiedResType,
  UserDetailsResType,
  UserLogoutResType,
} from '@/types/api/auth/auth';
import {
  AddPocketMoneyCredentialType,
  contactFormCredentialsType,
  DeleteUserCredType,
  LoginCredentialsType,
  RegisterCredentialsType,
  ResetPasswordCredType,
  SendResetLinkCredType,
  SignupGoogleCredentialsType,
  UpdateUserDetailsCredType,
} from '@/types/api/auth/credentials';

const cookie = new Cookies();

// --- Auth (public + protected) ----------------------------------------------

export const registerUser = async (
  credentials: RegisterCredentialsType,
): Promise<AuthResType> => {
  const { data } = await apiURL.post<AuthResType>(endpoints.auth.register, credentials);
  return data;
};

export const LoginUser = async (
  credentials: LoginCredentialsType,
): Promise<AuthResType> => {
  const { data } = await apiURL.post<AuthResType>(endpoints.auth.login, credentials);
  return data;
};

export const SignupWithGoogle = async (
  credentials: SignupGoogleCredentialsType,
): Promise<AuthResType> => {
  const { data } = await apiURL.post<AuthResType>(endpoints.auth.google, credentials);
  return data;
};

// Logout is now POST (was GET on the old server).
export const UserLogout = async (): Promise<UserLogoutResType> => {
  const { data } = await apiURL.post<UserLogoutResType>(endpoints.auth.logout);
  return data;
};

export const SendResetLinkToUserEmail = async (
  credentials: SendResetLinkCredType,
): Promise<SendPassResetLinkResType> => {
  const { data } = await apiURL.post<SendPassResetLinkResType>(
    endpoints.auth.passwordResetRequest,
    credentials,
  );
  return data;
};

// Reset is now POST (was PATCH on the old server).
export const ResetUserPassword = async (
  credentials: ResetPasswordCredType,
): Promise<ResetPasswordResType> => {
  const { data } = await apiURL.post<ResetPasswordResType>(
    endpoints.auth.passwordReset,
    credentials,
  );
  return data;
};

export const CheckUserAccountVerified = async (): Promise<UserAccountVerifiedResType> => {
  const { data } = await apiURL.get<UserAccountVerifiedResType>(endpoints.auth.meVerified);
  return data;
};

// --- Current user (profile) --------------------------------------------------

export const getCurrentUser = async (): Promise<UserDetailsResType> => {
  const token = cookie.get('accessToken');
  if (!token) throw new Error('Access token is missing. Please log in.');
  const { data } = await apiURL.get<UserDetailsResType>(endpoints.users.me);
  return data;
};

export const updatedUserDetails = async (
  credentials: UpdateUserDetailsCredType,
): Promise<UpdateUserDetailsResType> => {
  const { data } = await apiURL.patch<UpdateUserDetailsResType>(endpoints.users.me, credentials);
  return data;
};

// Avatar route is now PATCH /api/users/me/avatar (was POST /user/change-avatar).
export const changeUserAvatar = async (formData: FormData): Promise<ChangeAvatarResType> => {
  const config: AxiosRequestConfig = {
    headers: { Authorization: `Bearer ${getCurrentAccessToken()}` },
  };
  const { data } = await axios.patch<ChangeAvatarResType>(
    `${backendHostURL}${endpoints.users.avatar}`,
    formData,
    config,
  );
  return data;
};

export const deleteUserAccount = async (
  credentials: DeleteUserCredType,
): Promise<DeleteUserResType> => {
  const { data } = await apiURL.delete<DeleteUserResType>(endpoints.users.me, {
    data: credentials,
  });
  return data;
};

// --- Pocket money (kept in this file for backwards compatibility with current
// imports; will move to features/pocketMoney/api.ts in the next phase) -------

export const AddUserPocketMoney = async (
  credentials: AddPocketMoneyCredentialType,
): Promise<PocketMoneyResType> => {
  const { data } = await apiURL.post<PocketMoneyResType>(endpoints.pocketMoney.root, credentials);
  return data;
};

// --- Contact form (external service, unchanged) -----------------------------

export const submitContactForm = async (
  credentials: contactFormCredentialsType,
): Promise<ContactFormResType> => {
  const { data } = await axios.post<ContactFormResType>(contactFormServerHostURL, credentials);
  return data;
};

// --- Sessions ---------------------------------------------------------------

export const getUserSessions = async (): Promise<AllSessionsResType> => {
  const { data } = await apiURL.get<AllSessionsResType>(endpoints.sessions.list);
  return data;
};

// Now uses a path param (was DELETE /user/delete-active-session with body).
export const deleteOneUserSessions = async (credentials: {
  sessionId: string;
}): Promise<CommonNullResType> => {
  const { data } = await apiURL.delete<CommonNullResType>(
    endpoints.sessions.one(credentials.sessionId),
  );
  return data;
};

export const deleteAllUserSessions = async (): Promise<CommonNullResType> => {
  const { data } = await apiURL.delete<CommonNullResType>(endpoints.sessions.list);
  return data;
};
