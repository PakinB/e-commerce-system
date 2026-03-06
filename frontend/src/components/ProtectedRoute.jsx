import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="p-6 text-center text-slate-500">กำลังโหลดข้อมูล...</div>;
  return user ? children : <Navigate to="/login" replace />;
}