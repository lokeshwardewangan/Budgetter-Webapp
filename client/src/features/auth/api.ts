// Thin re-export so this feature owns its API surface. The actual axios
// callers still live in `src/services/auth.ts` during the gradual migration
// — once all consumers move into `features/`, the body can be inlined here.

export {
  LoginUser,
  registerUser,
  SignupWithGoogle,
  UserLogout,
  SendResetLinkToUserEmail,
  ResetUserPassword,
  CheckUserAccountVerified,
} from '@/services/auth';
