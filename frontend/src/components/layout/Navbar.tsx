import { useEffect, useRef, useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { Film, LogOut, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

// Email del administrador — comparamos en cliente solo para mostrar/ocultar el enlace.
// La validación real ocurre en el middleware del backend.
const ADMIN_EMAIL = import.meta.env.VITE_ADMIN_EMAIL as string | undefined;

export function Navbar() {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const [scrolled,     setScrolled]     = useState(false);
  const [menuOpen,     setMenuOpen]     = useState(false);
  const [signingOut,   setSigningOut]   = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Transición de transparente → negro+blur al hacer scroll (igual que Netflix)
  useEffect(() => {
    function handleScroll() {
      setScrolled(window.scrollY > 20);
    }
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar el menú móvil al hacer clic fuera
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    }
    if (menuOpen) document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [menuOpen]);

  async function handleSignOut() {
    setSigningOut(true);
    try {
      await signOut();
      navigate('/');
    } catch {
      // Si falla el signOut de Supabase, el usuario queda desconectado localmente de todos modos.
    } finally {
      setSigningOut(false);
    }
  }

  const isAdmin = user?.email === ADMIN_EMAIL;

  return (
    <nav
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[rgba(0,0,0,0.95)] backdrop-blur-[20px] shadow-[0_1px_0_rgba(255,255,255,0.05)]'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4 lg:px-[60px]">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 text-[#F5F5F7] no-underline">
          <Film size={22} className="text-[#E50914]" />
          <span className="text-lg font-semibold tracking-tight">CineAir</span>
        </Link>

        {/* Links de navegación — desktop */}
        <div className="hidden items-center gap-8 md:flex">
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `text-sm font-medium transition-colors no-underline ${
                isActive ? 'text-[#F5F5F7]' : 'text-[#86868B] hover:text-[#F5F5F7]'
              }`
            }
          >
            Inicio
          </NavLink>
          {user && (
            <NavLink
              to="/profile"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors no-underline ${
                  isActive ? 'text-[#F5F5F7]' : 'text-[#86868B] hover:text-[#F5F5F7]'
                }`
              }
            >
              Mi perfil
            </NavLink>
          )}
          {isAdmin && (
            <NavLink
              to="/admin"
              className={({ isActive }) =>
                `text-sm font-medium transition-colors no-underline ${
                  isActive ? 'text-[#E50914]' : 'text-[#86868B] hover:text-[#E50914]'
                }`
              }
            >
              Admin
            </NavLink>
          )}
        </div>

        {/* Auth — desktop */}
        <div className="hidden items-center gap-3 md:flex">
          {loading ? null : user ? (
            <>
              <span className="text-sm text-[#86868B] max-w-[160px] truncate">
                {user.email}
              </span>
              <button
                id="btn-signout"
                onClick={handleSignOut}
                disabled={signingOut}
                className="btn-ghost flex items-center gap-2"
              >
                <LogOut size={15} />
                {signingOut ? 'Saliendo…' : 'Salir'}
              </button>
            </>
          ) : (
            <Link to="/login" id="btn-login-nav" className="btn-primary py-2 px-5 text-sm no-underline">
              Iniciar sesión
            </Link>
          )}
        </div>

        {/* Hamburguesa — mobile */}
        <button
          id="btn-menu-mobile"
          className="flex flex-col gap-[5px] p-2 md:hidden"
          onClick={() => setMenuOpen(o => !o)}
          aria-label="Abrir menú"
        >
          <span className={`block h-[2px] w-6 bg-[#F5F5F7] transition-all ${menuOpen ? 'translate-y-[7px] rotate-45' : ''}`} />
          <span className={`block h-[2px] w-6 bg-[#F5F5F7] transition-all ${menuOpen ? 'opacity-0' : ''}`} />
          <span className={`block h-[2px] w-6 bg-[#F5F5F7] transition-all ${menuOpen ? '-translate-y-[7px] -rotate-45' : ''}`} />
        </button>
      </div>

      {/* Menú mobile desplegable */}
      {menuOpen && (
        <div ref={menuRef} className="border-t border-[#2A2A2A] bg-[rgba(0,0,0,0.97)] px-6 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink
              to="/"
              end
              onClick={() => setMenuOpen(false)}
              className={({ isActive }) =>
                `text-sm font-medium no-underline ${isActive ? 'text-[#F5F5F7]' : 'text-[#86868B]'}`
              }
            >
              Inicio
            </NavLink>
            {user && (
              <NavLink
                to="/profile"
                onClick={() => setMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-2 text-sm font-medium no-underline ${isActive ? 'text-[#F5F5F7]' : 'text-[#86868B]'}`
                }
              >
                <User size={15} />
                Mi perfil
              </NavLink>
            )}
            {isAdmin && (
              <NavLink
                to="/admin"
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-[#86868B] no-underline"
              >
                Admin
              </NavLink>
            )}
            <div className="border-t border-[#2A2A2A] pt-3">
              {user ? (
                <button
                  onClick={() => { setMenuOpen(false); handleSignOut(); }}
                  className="btn-ghost text-sm"
                >
                  <LogOut size={15} />
                  Cerrar sesión
                </button>
              ) : (
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="btn-primary py-2 px-4 text-sm no-underline"
                >
                  Iniciar sesión
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}
