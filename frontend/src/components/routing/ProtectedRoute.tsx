import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

// Rutas que requieren autenticación — redirigen a /login si no hay sesión.
// Mientras se restaura la sesión inicial mostramos null para evitar parpadeos.
export function ProtectedRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user)   return <Navigate to="/login" replace />;

  return <Outlet />;
}

// Rutas exclusivas del administrador.
// La validación real ocurre en el backend; aquí solo evitamos renderizar la UI a usuarios no admin.
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;

export function AdminRoute() {
  const { user, loading } = useAuth();

  if (loading) return null;
  if (!user)   return <Navigate to="/login" replace />;
  if (user.email !== ADMIN_EMAIL) return <Navigate to="/" replace />;

  return <Outlet />;
}
