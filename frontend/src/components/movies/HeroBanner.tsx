import { Link } from 'react-router-dom';
import { Play, Info } from 'lucide-react';
import type { MovieSummary } from '../../lib/api';

interface HeroBannerProps {
  movie: MovieSummary;
}

// Banner hero estilo Netflix: backdrop a pantalla completa con dos gradientes encima.
// results[0] de la página 1 actúa como película destacada.
export function HeroBanner({ movie }: HeroBannerProps) {
  const backdropUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const year = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  return (
    <section
      id="hero-banner"
      className="relative h-[56vh] min-h-[400px] w-full overflow-hidden md:h-[70vh]"
    >
      {/* Imagen de fondo */}
      {backdropUrl ? (
        <img
          src={backdropUrl}
          alt={`Backdrop de ${movie.title}`}
          className="absolute inset-0 h-full w-full object-cover object-top"
        />
      ) : (
        <div className="absolute inset-0 bg-[#0A0A0A]" />
      )}

      {/* Gradiente lateral: oscurece la izquierda donde va el texto */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(0,0,0,0.9)_40%,transparent)]" />
      {/* Gradiente inferior: conecta el hero con el fondo negro de la página */}
      <div className="absolute inset-0 bg-[linear-gradient(to_top,#000_10%,transparent)]" />

      {/* Contenido */}
      <div className="absolute inset-0 flex items-end pb-14 md:items-center md:pb-0">
        <div className="mx-auto w-full max-w-[1400px] px-6 lg:px-[60px]">
          <div className="max-w-2xl space-y-5">

            {/* Año como label pequeña */}
            {year && (
              <span className="inline-block text-[11px] font-semibold uppercase tracking-[0.1em] text-[#86868B]">
                {year}
              </span>
            )}

            {/* Título grande con text-shadow sutil */}
            <h1
              className="text-4xl font-bold leading-tight tracking-tight text-[#F5F5F7] sm:text-5xl md:text-6xl"
              style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}
            >
              {movie.title}
            </h1>

            {/* Sinopsis, recortada en 3 líneas */}
            {movie.overview && (
              <p className="line-clamp-3 max-w-lg text-[15px] leading-relaxed text-[#F5F5F7]/80">
                {movie.overview}
              </p>
            )}

            {/* CTAs estilo Apple glass + rojo Netflix */}
            <div className="flex flex-wrap items-center gap-3">
              <Link
                to={`/movies/${movie.id}`}
                id={`hero-btn-detail-${movie.id}`}
                className="btn-primary flex items-center gap-2 no-underline"
              >
                <Play size={18} fill="white" />
                Ver detalle
              </Link>
              <Link
                to={`/movies/${movie.id}`}
                className="btn-secondary flex items-center gap-2 no-underline"
              >
                <Info size={18} />
                Más información
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
