import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default function RequireAuth() {
  const token = cookies.get('accessToken');
  if (!token) return <Navigate to="/login" replace />;
  return <Outlet />;
}
