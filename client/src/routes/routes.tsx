import AccountVerified from '@/components/auth/AccountVerified';
import AccountAlreadyVerified from '@/components/auth/AccountAlreadyVerified';
import LoginForm from '@/features/auth/components/LoginForm';
import SignupForm from '@/features/auth/components/SignupForm';
import ForgotPasswordForm from '@/features/auth/components/ForgotPasswordForm';
import ResetPasswordForm from '@/features/auth/components/ResetPasswordForm';
import AuthLayout from '@/pages/auth/AuthLayout';
import MainLayout from '@/pages/MainLayout';
import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
} from 'react-router-dom';
import UserLayout from '@/pages/user/UserLayout';
import HomePage from '@/pages/home/HomePage';
import Dashboard from '@/pages/user/dashboard/Dashboard';
import AddMoney from '@/pages/user/addMoney/AddMoney';
import ShowExpenses from '@/pages/user/showExpenses/ShowExpenses';
import AddExpenses from '@/pages/user/addExpenses/AddExpenses';
import ProfilePage from '@/pages/user/Profile/ProfilePage';
import Reports from '@/pages/user/reports/Reports';
import AddLentMoney from '@/pages/user/addLentMoney/AddLentMoney';
import ErrorPage from '@/components/layout/ErrorPage';

const routes = createBrowserRouter(
  createRoutesFromElements(
    <Route element={<MainLayout />}>
      {/* public routes */}
      <Route element={<AuthLayout />}>
        <Route path="login" element={<LoginForm />} />
        <Route path="signup" element={<SignupForm />} />
        <Route path="forgot-password" element={<ForgotPasswordForm />} />
        <Route path="account-verified" element={<AccountVerified />} />
        <Route
          path="account-already-verified"
          element={<AccountAlreadyVerified />}
        />
        <Route path="reset-password/*" element={<ResetPasswordForm />} />
      </Route>

      {/* protected routes */}
      <Route path="user" element={<UserLayout />}>
        <Route index element={<Navigate to="profile" replace />} />
        <Route path="profile" element={<ProfilePage />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="add-expenses" element={<AddExpenses />} />
        <Route path="show-expenses" element={<ShowExpenses />} />
        <Route path="reports" element={<Reports />} />
        <Route path="reports" element={<Dashboard />} />
        <Route path="add-money" element={<AddMoney />} />
        <Route path="add-lent-money" element={<AddLentMoney />} />
      </Route>

      {/* home */}
      <Route path="/" element={<HomePage />} />
      {/* logout page routes */}
      <Route path="logout" element={<Navigate to="/login" />} />
      {/* Error page */}
      <Route path="/*" element={<ErrorPage />} />
    </Route>
  ),
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true,
    } as any,
  }
);

export default routes;
