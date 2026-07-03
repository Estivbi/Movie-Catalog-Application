import { Link } from 'react-router-dom';
import type { MovieSummary } from '../../lib/api';

function formatPosterUrl(posterPath: string | null) {
  return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null;
}

interface MovieCardProps {
  movie:  MovieSummary;
  /** Índice para calcular el stagger de la animación de entrada */
  index?: number;
}

// Card de película con aspecto 2/3 (poster vertical Netflix),
// overlay de información en hover y animación fadeInUp escalonada.
export function MovieCard({ movie, index = 0 }: MovieCardProps) {
  const posterUrl = formatPosterUrl(movie.poster_path);
  const year      = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  return (
    <Link
      to={`/movies/${movie.id}`}
      id={`movie-card-${movie.id}`}
      className="block no-underline"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <article className="movie-card animate-fade-in-up opacity-0 [animation-fill-mode:forwards]">
        {/* Poster */}
        {posterUrl ? (
          <img src={posterUrl} alt={movie.title} loading="lazy" />
        ) : (
          <div className="flex h-full items-center justify-center bg-[#0A0A0A] text-sm text-[#48484A]">
            Sin póster
          </div>
        )}

        {/* Badge de puntuación — siempre visible en esquina superior derecha */}
        <div className="absolute right-3 top-3 rounded-full border border-white/10 bg-black/60 px-2 py-1 text-[11px] font-semibold text-[#F5F5F7] backdrop-blur-md">
          {movie.vote_average.toFixed(1)}
        </div>

        {/* Overlay con título y año, aparece en hover */}
        <div className="card-overlay">
          <h2 className="line-clamp-2 text-[14px] font-semibold leading-tight text-[#F5F5F7]">
            {movie.title}
          </h2>
          {year && (
            <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-[#86868B]">
              {year}
            </p>
          )}
        </div>
      </article>
    </Link>
  );
}
