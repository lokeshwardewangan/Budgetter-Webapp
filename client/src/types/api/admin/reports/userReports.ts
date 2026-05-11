// Shape returned by GET /api/admin/users. The server now returns user docs
// without embedded PocketMoneyHistory / LentMoneyHistory (those collections
// were split out in the model refactor) — admin views show profile + balance
// only. If we want per-user totals later, the server can join them in.

export type User = {
  _id: string;
  username: string;
  name: string;
  email: string;
  avatar: string;
  dateOfBirth?: string;
  profession?: string;
  instagramLink?: string;
  facebookLink?: string;
  currentPocketMoney: string;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
};

export interface AppUsersResType {
  statusCode: number;
  data: User[];
  message: string;
  success: boolean;
}

export interface NewsletterResType {
  statusCode: number;
  data: null;
  message: string;
  success: boolean;
}
