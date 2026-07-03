import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { HeroBanner } from '../components/movies/HeroBanner';
import { MovieCard } from '../components/movies/MovieCard';
import { fetchPopularMovies, type MovieSummary } from '../lib/api';

// Skeleton de card con shimmer para el estado de carga
function CardSkeleton() {
  return (
    <div className="skeleton aspect-[2/3] w-full rounded-card" />
  );
}

export function HomePage() {
  const [page,         setPage]         = useState(1);
  const [reloadToken,  setReloadToken]  = useState(0);
  const [totalPages,   setTotalPages]   = useState(1);
  const [movies,       setMovies]       = useState<MovieSummary[]>([]);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMovies() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchPopularMovies(page);
        if (cancelled) return;
        setMovies(response.results);
        setTotalPages(Math.min(response.total_pages, 500)); // TMDB limita a 500 páginas
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Error inesperado');
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    loadMovies();
    return () => { cancelled = true; };
  }, [page, reloadToken]);

  // La película destacada en el hero es siempre la primera de la página 1
  const featuredMovie = page === 1 && movies.length > 0 ? movies[0] : null;

  return (
    <div className="min-h-screen bg-[#000]">

      {/* Hero banner — solo en la primera página */}
      {loading && page === 1 ? (
        <div className="skeleton h-[56vh] min-h-[400px] w-full md:h-[70vh]" />
      ) : featuredMovie ? (
        <HeroBanner movie={featuredMovie} />
      ) : null}

      {/* Catálogo */}
      <main className="mx-auto max-w-[1400px] px-6 py-10 lg:px-[60px]">

        {/* Error */}
        {error && (
          <div className="mb-8 rounded-xl border border-[#FF453A]/20 bg-[#FF453A]/10 p-4 text-[14px] text-[#FF453A]">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>{error}</p>
              <button
                className="btn-primary py-2 px-4 text-sm"
                onClick={() => setReloadToken(t => t + 1)}
              >
                Reintentar
              </button>
            </div>
          </div>
        )}

        {/* Encabezado de sección */}
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-[24px] font-semibold tracking-[-0.01em] text-[#F5F5F7]">
            Películas populares
          </h2>
          <span className="hidden text-[13px] text-[#86868B] sm:block">
            Página {page} de {totalPages}
          </span>
        </div>

        {/* Grid de cards — 6 cols desktop / 4 tablet / 2 móvil */}
        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {Array.from({ length: 18 }).map((_, i) => <CardSkeleton key={i} />)}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {movies.map((movie, index) => (
              <MovieCard key={movie.id} movie={movie} index={index} />
            ))}
          </div>
        )}

        {/* Paginación */}
        {!loading && !error && (
          <div className="mt-12 flex justify-center">
            <ReactPaginate
              breakLabel="…"
              nextLabel="Siguiente →"
              previousLabel="← Anterior"
              onPageChange={({ selected }) => {
                setPage(selected + 1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              pageRangeDisplayed={3}
              marginPagesDisplayed={1}
              pageCount={totalPages}
              forcePage={page - 1}
              containerClassName="pagination"
              activeClassName="active"
              disabledClassName="disabled"
              breakClassName="break"
            />
          </div>
        )}
      </main>
    </div>
  );
}
