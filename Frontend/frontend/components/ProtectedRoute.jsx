import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children, allowedRoles }) {
  const token = localStorage.getItem('token');
  // LocalStorage ya state se user object nikal rahe hain (role check ke liye)
  const user = JSON.parse(localStorage.getItem('user'));

  // 1. Agar token nahi hai, toh login page par bhej do
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // 2. Agar specific roles define hain aur user ka role match nahi karta
  if (allowedRoles && (!user || !allowedRoles.includes(user.role))) {
    // Role access na hone par home ya unauthorized page par bhej do
    return <Navigate to="/" replace />;
  }

  return children;
}