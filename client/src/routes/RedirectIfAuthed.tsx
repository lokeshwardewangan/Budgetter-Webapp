import { Navigate, Outlet } from 'react-router-dom';
import Cookies from 'universal-cookie';

const cookies = new Cookies();

export default function RedirectIfAuthed() {
  const token = cookies.get('accessToken');
  if (token) return <Navigate to="/user/dashboard" replace />;
  return <Outlet />;
}
