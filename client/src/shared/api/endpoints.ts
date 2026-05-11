// Central registry of every backend URL the client calls.
// All paths are relative to the axios baseURL (which already includes `/api`).
// Path-parameterised routes are exposed as functions so call-sites stay typed.

export const endpoints = {
  auth: {
    register: '/auth/register',
    login: '/auth/login',
    google: '/auth/google',
    logout: '/auth/logout',
    accountVerification: '/auth/account-verification',
    passwordResetRequest: '/auth/password-reset/request',
    passwordResetValidate: '/auth/password-reset/validate',
    passwordReset: '/auth/password-reset',
    meVerified: '/auth/me/verified',
  },
  users: {
    me: '/users/me',
    avatar: '/users/me/avatar',
  },
  sessions: {
    list: '/sessions',
    one: (id: string) => `/sessions/${id}`,
  },
  expenses: {
    list: '/expenses',
    addToday: '/expenses',
    bulk: '/expenses/bulk',
    today: '/expenses/today',
    byDate: '/expenses/by-date',
    feed: '/expenses/feed',
    product: (productId: string) => `/expenses/products/${productId}`,
  },
  pocketMoney: {
    root: '/pocket-money',
  },
  lentMoney: {
    root: '/lent-money',
    receive: (id: string) => `/lent-money/${id}/receive`,
  },
  reports: {
    monthly: '/reports/monthly',
  },
  admin: {
    users: '/admin/users',
    newsletter: '/admin/newsletter',
  },
} as const;
