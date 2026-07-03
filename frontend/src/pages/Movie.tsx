import { useEffect, useState, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Clock, Star as StarIcon, MessageCircle } from 'lucide-react';
import {
  fetchMovieDetail,
  postComment,
  putComment,
  deleteComment,
  postRating,
  type MovieDetailResponse,
  type Comment,
} from '../lib/api';
import { useAuth } from '../contexts/AuthContext';
import { StarRating } from '../components/ui/StarRating';
import { CommentForm } from '../components/movies/CommentForm';
import { CommentList } from '../components/movies/CommentList';

function formatRuntime(minutes: number | null): string {
  if (!minutes) return '';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

// Skeleton del detalle — mantiene el layout durante la carga para evitar saltos de contenido
function DetailSkeleton() {
  return (
    <div className="animate-fade-in">
      <div className="skeleton h-[50vh] w-full" />
      <div className="mx-auto max-w-[1400px] px-6 py-10 lg:px-[60px]">
        <div className="flex flex-col gap-10 md:flex-row">
          <div className="skeleton h-[360px] w-[240px] shrink-0 rounded-card" />
          <div className="flex-1 space-y-4">
            <div className="skeleton h-10 w-2/3 rounded-lg" />
            <div className="skeleton h-5 w-1/3 rounded-lg" />
            <div className="skeleton h-24 w-full rounded-lg" />
          </div>
        </div>
      </div>
    </div>
  );
}

export function MoviePage() {
  const { id }       = useParams<{ id: string }>();
  const { user, session } = useAuth();

  const [data,      setData]      = useState<MovieDetailResponse | null>(null);
  const [comments,  setComments]  = useState<Comment[]>([]);
  const [loading,   setLoading]   = useState(true);
  const [error,     setError]     = useState<string | null>(null);
  const [userRating, setUserRating] = useState<number | null>(null);
  const [ratingLoading, setRatingLoading] = useState(false);

  const loadDetail = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const result = await fetchMovieDetail(id);
      setData(result);
      setComments(result.comments);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error al cargar el detalle');
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => { loadDetail(); }, [loadDetail]);

  async function handleRate(score: number) {
    if (!session) return;
    setRatingLoading(true);
    try {
      await postRating(id!, score, session.access_token);
      setUserRating(score);
      // Recargamos para actualizar el rating medio
      const updated = await fetchMovieDetail(id!);
      setData(updated);
    } finally {
      setRatingLoading(false);
    }
  }

  async function handlePostComment(content: string) {
    if (!session) return;
    const { comment } = await postComment(id!, content, session.access_token);
    // Añadimos el nuevo comentario al principio sin recargar toda la página
    setComments(prev => [comment, ...prev]);
  }

  async function handleEditComment(commentId: string, newContent: string) {
    if (!session) return;
    const { comment } = await putComment(commentId, newContent, session.access_token);
    setComments(prev => prev.map(c => c.id === commentId ? comment : c));
  }

  async function handleDeleteComment(commentId: string) {
    if (!session) return;
    await deleteComment(commentId, session.access_token);
    setComments(prev => prev.filter(c => c.id !== commentId));
  }

  if (loading) return <DetailSkeleton />;

  if (error || !data) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#000] px-6">
        <div className="text-center space-y-4">
          <p className="text-[#FF453A]">{error ?? 'Película no encontrada'}</p>
          <Link to="/" className="btn-primary no-underline inline-flex">← Volver</Link>
        </div>
      </div>
    );
  }

  const { movie, rating_average, rating_count } = data;
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;
  const posterUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;
  const year = movie.release_date ? new Date(movie.release_date).getFullYear() : null;

  return (
    <div className="min-h-screen bg-[#000]">

      {/* Backdrop con gradientes */}
      <div className="relative h-[50vh] w-full overflow-hidden">
        {backdropUrl && (
          <img
            src={backdropUrl}
            alt={`Backdrop de ${movie.title}`}
            className="absolute inset-0 h-full w-full object-cover object-top"
          />
        )}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.8)_40%,transparent)]" />
        <div className="absolute inset-0 bg-[linear-gradient(to_top,#000_15%,transparent)]" />

        {/* Botón volver */}
        <div className="absolute left-6 top-24 lg:left-[60px]">
          <Link
            to="/"
            className="btn-secondary flex items-center gap-2 py-2 px-4 text-sm no-underline"
          >
            <ArrowLeft size={16} />
            Catálogo
          </Link>
        </div>
      </div>

      {/* Contenido principal */}
      <main className="mx-auto max-w-[1400px] px-6 lg:px-[60px]">
        <div className="flex flex-col gap-8 md:flex-row md:-mt-32 lg:-mt-48">

          {/* Poster */}
          {posterUrl && (
            <div className="hidden shrink-0 md:block">
              <img
                src={posterUrl}
                alt={`Poster de ${movie.title}`}
                className="w-[200px] rounded-card shadow-[0_20px_60px_rgba(0,0,0,0.8)] lg:w-[240px]"
              />
            </div>
          )}

          {/* Info */}
          <div className="flex-1 space-y-5 pt-2">
            {/* Géneros */}
            {movie.genres.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {movie.genres.map(g => (
                  <span
                    key={g.id}
                    className="rounded-full border border-[#2A2A2A] bg-[#1A1A1A] px-3 py-1 text-[11px] font-medium uppercase tracking-[0.08em] text-[#86868B]"
                  >
                    {g.name}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl font-bold tracking-tight text-[#F5F5F7] sm:text-4xl lg:text-5xl">
              {movie.title}
            </h1>

            {/* Metadatos */}
            <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#86868B]">
              {year    && <span>{year}</span>}
              {movie.runtime && (
                <span className="flex items-center gap-1">
                  <Clock size={13} />
                  {formatRuntime(movie.runtime)}
                </span>
              )}
              {rating_average !== null && (
                <span className="flex items-center gap-1">
                  <StarIcon size={13} fill="#FFD60A" color="#FFD60A" />
                  {rating_average.toFixed(1)} ({rating_count} {rating_count === 1 ? 'valoración' : 'valoraciones'})
                </span>
              )}
            </div>

            {/* Sinopsis */}
            {movie.overview && (
              <p className="max-w-2xl text-[15px] leading-relaxed text-[#F5F5F7]/80">
                {movie.overview}
              </p>
            )}

            {/* Rating del usuario */}
            <div className="rounded-xl border border-[#2A2A2A] bg-[#0A0A0A] p-5">
              <h3 className="mb-3 text-[13px] font-semibold uppercase tracking-[0.08em] text-[#86868B]">
                Tu valoración
              </h3>
              {user ? (
                <div className="flex items-center gap-3">
                  <StarRating
                    value={userRating}
                    interactive={!ratingLoading}
                    onRate={handleRate}
                    size={24}
                  />
                  {ratingLoading && (
                    <span className="text-[13px] text-[#86868B]">Guardando…</span>
                  )}
                  {userRating && !ratingLoading && (
                    <span className="text-[13px] text-[#30D158]">¡Valoración guardada!</span>
                  )}
                </div>
              ) : (
                <p className="text-[14px] text-[#86868B]">
                  <Link to="/login" className="text-[#E50914] no-underline hover:underline">
                    Inicia sesión
                  </Link>{' '}
                  para valorar esta película.
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sección de comentarios */}
        <section id="comments-section" className="mt-12 space-y-6 pb-16">
          <div className="flex items-center gap-2 border-b border-[#2A2A2A] pb-4">
            <MessageCircle size={18} className="text-[#86868B]" />
            <h2 className="text-[20px] font-semibold tracking-tight text-[#F5F5F7]">
              Comentarios{comments.length > 0 && ` (${comments.length})`}
            </h2>
          </div>

          {user ? (
            <div className="mb-6">
              <CommentForm onSubmit={handlePostComment} />
            </div>
          ) : (
            <p className="text-[14px] text-[#86868B]">
              <Link to="/login" className="text-[#E50914] no-underline hover:underline">
                Inicia sesión
              </Link>{' '}
              para dejar un comentario.
            </p>
          )}

          <CommentList
            comments={comments}
            currentUserId={user?.id}
            onEdit={handleEditComment}
            onDelete={handleDeleteComment}
          />
        </section>
      </main>
    </div>
  );
}
