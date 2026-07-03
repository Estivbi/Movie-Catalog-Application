import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User, MessageSquare, Star as StarIcon } from 'lucide-react';
import { fetchProfile, type UserProfileResponse } from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { StarRating } from '../components/ui/StarRating';

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] px-6 py-5 text-center">
      <p className="text-3xl font-bold text-[#F5F5F7]">{value}</p>
      <p className="mt-1 text-[12px] font-medium uppercase tracking-[0.08em] text-[#86868B]">{label}</p>
    </div>
  );
}

export function ProfilePage() {
  const { user, session } = useAuth();
  const [profile,  setProfile]  = useState<UserProfileResponse | null>(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState<string | null>(null);

  useEffect(() => {
    if (!session) return;

    async function load() {
      setLoading(true);
      try {
        const data = await fetchProfile(session!.access_token);
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error al cargar el perfil');
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [session]);

  // Generamos las iniciales del avatar a partir del email si no hay avatar_url
  const initials = user?.email?.[0]?.toUpperCase() ?? '?';

  return (
    <div className="min-h-screen bg-[#000] pt-24 pb-16">
      <main className="mx-auto max-w-3xl px-6">

        {/* Avatar + info del usuario */}
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full border-2 border-[#E50914] bg-[#1A1A1A] text-2xl font-bold text-[#F5F5F7]">
            {profile?.profile?.avatar_url ? (
              <img
                src={profile.profile.avatar_url}
                alt="Avatar"
                className="h-full w-full rounded-full object-cover"
              />
            ) : (
              initials
            )}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-[#F5F5F7]">
              {profile?.profile?.display_name ?? user?.email}
            </h1>
            <p className="text-[14px] text-[#86868B]">{user?.email}</p>
          </div>
        </div>

        {loading && (
          <div className="space-y-4">
            <div className="flex gap-4">
              {[0,1].map(i => <div key={i} className="skeleton h-24 flex-1 rounded-xl" />)}
            </div>
            <div className="skeleton h-40 w-full rounded-xl" />
          </div>
        )}

        {error && (
          <p className="text-center text-[#FF453A]">{error}</p>
        )}

        {profile && !loading && (
          <>
            {/* Stats */}
            <div className="mb-8 grid grid-cols-2 gap-4">
              <StatCard label="Comentarios" value={profile.comments.length} />
              <StatCard label="Valoraciones"   value={profile.ratings.length} />
            </div>

            {/* Mis comentarios */}
            <section className="mb-8 space-y-4">
              <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-3">
                <MessageSquare size={16} className="text-[#86868B]" />
                <h2 className="text-[18px] font-semibold text-[#F5F5F7]">Mis comentarios</h2>
              </div>

              {profile.comments.length === 0 ? (
                <p className="py-6 text-center text-[14px] text-[#48484A]">
                  Aún no has comentado ninguna película.
                </p>
              ) : (
                <ul className="space-y-3">
                  {profile.comments.map(comment => (
                    <li
                      key={comment.id}
                      className="rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] p-4"
                    >
                      <div className="mb-2 flex items-center justify-between">
                        <Link
                          to={`/movies/${comment.tmdb_movie_id}`}
                          className="text-[12px] font-semibold uppercase tracking-[0.08em] text-[#E50914] no-underline hover:underline"
                        >
                          Película #{comment.tmdb_movie_id}
                        </Link>
                        <span className="text-[11px] text-[#48484A]">
                          {new Date(comment.created_at).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                      <p className="text-[14px] leading-relaxed text-[#F5F5F7]/80">
                        {comment.content}
                      </p>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            {/* Mis valoraciones */}
            <section className="space-y-4">
              <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-3">
                <StarIcon size={16} className="text-[#FFD60A]" />
                <h2 className="text-[18px] font-semibold text-[#F5F5F7]">Mis valoraciones</h2>
              </div>

              {profile.ratings.length === 0 ? (
                <p className="py-6 text-center text-[14px] text-[#48484A]">
                  Aún no has valorado ninguna película.
                </p>
              ) : (
                <ul className="space-y-3">
                  {profile.ratings.map(rating => (
                    <li
                      key={rating.id}
                      className="flex items-center justify-between rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] p-4"
                    >
                      <Link
                        to={`/movies/${rating.tmdb_movie_id}`}
                        className="text-[14px] font-medium text-[#F5F5F7] no-underline hover:text-[#E50914] transition-colors"
                      >
                        Película #{rating.tmdb_movie_id}
                      </Link>
                      <div className="flex items-center gap-3">
                        <StarRating value={rating.score} size={16} />
                        <span className="text-[11px] text-[#48484A]">
                          {new Date(rating.created_at).toLocaleDateString('es-ES')}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}

        {/* Enlace de ayuda si no hay sesión — no debería llegar aquí gracias a ProtectedRoute */}
        {!user && !loading && (
          <div className="text-center">
            <Link to="/login" className="btn-primary no-underline inline-flex">
              <User size={16} />
              Iniciar sesión
            </Link>
          </div>
        )}
      </main>
    </div>
  );
}
