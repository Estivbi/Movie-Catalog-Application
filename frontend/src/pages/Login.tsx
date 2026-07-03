import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Film, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

type Tab = 'login' | 'register';

export function LoginPage() {
  const { signIn, signUp } = useAuth();
  const navigate            = useNavigate();

  const [tab,         setTab]         = useState<Tab>('login');
  const [email,       setEmail]       = useState('');
  const [password,    setPassword]    = useState('');
  const [showPass,    setShowPass]    = useState(false);
  const [loading,     setLoading]     = useState(false);
  const [error,       setError]       = useState<string | null>(null);
  const [successMsg,  setSuccessMsg]  = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (tab === 'login') {
        await signIn(email, password);
        navigate('/');
      } else {
        await signUp(email, password);
        // Supabase envía un email de confirmación por defecto
        setSuccessMsg('¡Cuenta creada! Revisa tu correo para confirmar la cuenta.');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#000] px-4 py-20">
      <div className="w-full max-w-md">

        {/* Logo centrado */}
        <div className="mb-8 flex flex-col items-center gap-2">
          <Link to="/" className="flex items-center gap-2 text-[#F5F5F7] no-underline">
            <Film size={28} className="text-[#E50914]" />
            <span className="text-2xl font-semibold tracking-tight">CineAir</span>
          </Link>
        </div>

        {/* Card glassmorphism */}
        <div className="glass-card p-8">

          {/* Tabs */}
          <div className="mb-7 flex rounded-lg border border-[#2A2A2A] bg-[#0A0A0A] p-1">
            {(['login', 'register'] as Tab[]).map((t) => (
              <button
                key={t}
                id={`tab-${t}`}
                type="button"
                onClick={() => { setTab(t); setError(null); setSuccessMsg(null); }}
                className={`flex-1 rounded-md py-2 text-[14px] font-medium transition-colors ${
                  tab === t
                    ? 'bg-[#1A1A1A] text-[#F5F5F7]'
                    : 'text-[#86868B] hover:text-[#F5F5F7]'
                }`}
              >
                {t === 'login' ? 'Iniciar sesión' : 'Registrarse'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Email con label flotante */}
            <div className="input-group">
              <input
                id="input-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder=" "
                required
                autoComplete="email"
                className="input-field"
              />
              <label htmlFor="input-email" className="input-label">Correo electrónico</label>
            </div>

            {/* Contraseña con toggle de visibilidad */}
            <div className="input-group">
              <input
                id="input-password"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
                autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                minLength={6}
                className="input-field pr-12"
              />
              <label htmlFor="input-password" className="input-label">Contraseña</label>
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPass(s => !s)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#86868B] hover:text-[#F5F5F7] transition-colors border-none bg-transparent p-0 cursor-pointer"
                aria-label={showPass ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            {/* Mensajes de estado */}
            {error && (
              <p id="auth-error" className="text-[13px] text-[#FF453A]">{error}</p>
            )}
            {successMsg && (
              <p id="auth-success" className="text-[13px] text-[#30D158]">{successMsg}</p>
            )}

            {/* Submit */}
            <button
              id="btn-auth-submit"
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center py-3 text-[15px] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading
                ? (tab === 'login' ? 'Entrando…' : 'Registrando…')
                : (tab === 'login' ? 'Iniciar sesión' : 'Crear cuenta')}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-[13px] text-[#86868B]">
          <Link to="/" className="text-[#F5F5F7] hover:text-[#E50914] transition-colors no-underline">
            ← Volver al catálogo
          </Link>
        </p>
      </div>
    </div>
  );
}
