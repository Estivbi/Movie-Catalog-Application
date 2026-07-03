import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { ProtectedRoute, AdminRoute } from './components/routing/ProtectedRoute';
import { HomePage }    from './pages/Home';
import { MoviePage }   from './pages/Movie';
import { LoginPage }   from './pages/Login';
import { ProfilePage } from './pages/Profile';
import { AdminPage }   from './pages/Admin';

// El router y el AuthProvider envuelven toda la app para que cualquier
// componente pueda acceder a la navegación y al estado de sesión.
export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        {/* Navbar fija — se renderiza en todas las rutas */}
        <Navbar />

        <Routes>
          {/* Rutas públicas */}
          <Route path="/"          element={<HomePage />} />
          <Route path="/movies/:id" element={<MoviePage />} />
          <Route path="/login"     element={<LoginPage />} />

          {/* Rutas protegidas — requieren sesión activa */}
          <Route element={<ProtectedRoute />}>
            <Route path="/profile" element={<ProfilePage />} />
          </Route>

          {/* Rutas de admin — requieren sesión + email admin */}
          <Route element={<AdminRoute />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}