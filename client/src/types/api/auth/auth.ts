// Response payloads from the new REST server. Field names mirror the
// server's `getMe` and friends (lowercased histories, `currentSession`).

export interface PocketMoneyEntry {
  _id: string;
  date: string;
  amount: string;
  source: string;
  createdAt: string;
  updatedAt: string;
}

export interface LentMoneyEntry {
  _id: string;
  personName: string;
  price: string;
  date: string;
  isReceived?: boolean;
  receivedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface SessionEntry {
  _id: string;
  userAgent: string;
  ip: string;
  lastUsedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserPayload {
  _id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  currentPocketMoney: string;
  isVerified: boolean;
  profession: string;
  dob: string;
  instagramLink: string;
  facebookLink: string;
  currentSession: SessionEntry[];
  createdAt: string;
  lastLogin: string | Date;
  updatedAt?: string;
}

// Returned by GET /api/users/me — the user payload is flat in `data`.
export interface UserDetailsResType {
  statusCode: number;
  data: UserPayload;
  message: string;
  success: boolean;
}

// Returned by POST /api/auth/{login,register,google} — wraps the user + token.
export interface AuthResType {
  statusCode: number;
  data: {
    user: UserPayload;
    token: string;
    isNewUser?: boolean;
  };
  message: string;
  success: boolean;
}

export interface PocketMoneyResType {
  statusCode: number;
  data: {
    entry: PocketMoneyEntry;
    currentPocketMoney: string;
  };
  message: string;
  success: boolean;
}

export interface UserLogoutResType {
  statusCode: number;
  data: null;
  message: string;
  success: boolean;
}

export interface ChangeAvatarResType {
  statusCode: number;
  data: {
    avatar: string;
  };
  message: string;
  success: boolean;
}

export interface SendPassResetLinkResType {
  statusCode: number;
  data: string | null;
  message: string;
  success: boolean;
}

export interface ResetPasswordResType {
  statusCode: number;
  data: null;
  message: string;
  success: boolean;
}

export interface UserAccountVerifiedResType {
  statusCode: number;
  data: boolean;
  message: string;
  success: boolean;
}

export interface UpdateUserDetailsResType {
  statusCode: number;
  data: string | null;
  message: string;
  success: boolean;
}

export interface DeleteUserResType {
  statusCode: number;
  data: null;
  message: string;
  success: boolean;
}

export interface ContactFormResType {
  statusCode: number;
  data: null;
  message: string;
  success: boolean;
}

export interface CommonNullResType {
  statusCode: number;
  data: null;
  message: string;
  success: boolean;
}

// Re-exported under the old name for components that haven't migrated yet.
export type SessionType = SessionEntry;

export interface AllSessionsResType {
  statusCode: number;
  data: SessionEntry[];
  message: string;
  success: boolean;
}
