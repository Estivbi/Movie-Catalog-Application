import type { MovieSummary } from '../../lib/api';
import { Card, CardContent } from '../ui/card';
import { SpotlightCard } from '../magic/spotlight-card';

function formatPosterUrl(posterPath: string | null) {
  return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null;
}

export function MovieCard({ movie }: { movie: MovieSummary }) {
  const posterUrl = formatPosterUrl(movie.poster_path);

  return (
    <SpotlightCard className="h-full">
      <Card className="h-full border-0 bg-transparent shadow-none">
        <div className="relative aspect-[2/3] overflow-hidden bg-[#0c1224]">
          {posterUrl ? (
            <img
              src={posterUrl}
              alt={movie.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full items-center justify-center px-6 text-center text-sm text-white/55">
              Póster no disponible
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/10 to-transparent" />
          <div className="absolute left-4 top-4 rounded-full border border-white/10 bg-black/40 px-3 py-1 text-[0.62rem] font-medium uppercase tracking-[0.28em] text-white/80 backdrop-blur-md">
            Película
          </div>
        </div>

        <CardContent className="relative space-y-4 p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="space-y-1">
              <h2 className="line-clamp-1 text-[1.05rem] font-semibold tracking-tight text-white">{movie.title}</h2>
              <p className="text-xs uppercase tracking-[0.22em] text-white/45">
                {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Sin fecha'}
              </p>
            </div>
            <span className="shrink-0 rounded-full border border-white/10 bg-white/8 px-3 py-1 text-xs font-semibold text-white">
              {movie.vote_average.toFixed(1)}
            </span>
          </div>
          <p className="line-clamp-4 text-sm leading-6 text-white/68">
            {movie.overview || 'Sin sinopsis disponible.'}
          </p>
          <div className="flex items-center justify-between border-t border-white/8 pt-4 text-[0.65rem] uppercase tracking-[0.22em] text-white/35">
            <span>Disponible ahora</span>
            <span>Ver detalles</span>
          </div>
        </CardContent>
      </Card>
    </SpotlightCard>
  );
}
