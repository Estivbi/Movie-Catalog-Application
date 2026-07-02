import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { fetchPopularMovies, type MovieSummary } from './lib/api';

function formatPosterUrl(posterPath: string | null) {
  return posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : null;
}

function MovieCard({ movie }: { movie: MovieSummary }) {
  const posterUrl = formatPosterUrl(movie.poster_path);

  // La tarjeta es la unidad visual principal del catálogo, por eso concentra jerarquía y estado hover.
  return (
    <article className="group overflow-hidden rounded-3xl border border-border bg-surface/80 shadow-glow transition duration-300 hover:-translate-y-1 hover:border-orange-400/30">
      <div className="relative aspect-[2/3] overflow-hidden bg-surfaceElevated">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center px-6 text-center text-sm text-muted">
            Póster no disponible
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      <div className="space-y-3 p-4">
        <div className="space-y-1">
          <h2 className="line-clamp-1 text-lg font-semibold text-text">{movie.title}</h2>
          <p className="text-sm text-muted">
            {movie.release_date ? new Date(movie.release_date).getFullYear() : 'Sin fecha'}
          </p>
        </div>
        <p className="line-clamp-3 text-sm leading-6 text-muted">{movie.overview || 'Sin sinopsis disponible.'}</p>
        <div className="flex items-center justify-between border-t border-border pt-3 text-sm">
          <span className="text-muted">TMDB</span>
          <span className="rounded-full bg-orange-500/15 px-3 py-1 font-medium text-orange-300">
            {movie.vote_average.toFixed(1)}
          </span>
        </div>
      </div>
    </article>
  );
}

export default function App() {
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [movies, setMovies] = useState<MovieSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadMovies() {
      setLoading(true);
      setError(null);

      try {
        const response = await fetchPopularMovies(page);

        if (cancelled) {
          return;
        }

        setMovies(response.results);
        setTotalPages(response.total_pages);
      } catch (loadError) {
        if (!cancelled) {
          setError(loadError instanceof Error ? loadError.message : 'Error inesperado');
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadMovies();

    return () => {
      cancelled = true;
    };
  }, [page]);

  return (
    <main className="min-h-screen bg-cinema-radial px-4 py-8 text-text sm:px-6 lg:px-10">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-10">
        <header className="max-w-3xl space-y-5">
          <span className="inline-flex rounded-full border border-orange-400/20 bg-orange-400/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em] text-orange-200">
            Movie Catalog Application
          </span>
          <div className="space-y-3">
            <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">
              Catálogo premium de películas para una aerolínea.
            </h1>
            <p className="max-w-2xl text-base leading-7 text-muted sm:text-lg">
              Explora el catálogo en runtime desde TMDB, navega con paginación nativa y deja comentarios y ratings sobre cada película.
            </p>
          </div>
        </header>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
            {error}
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <div key={index} className="h-[520px] animate-pulse rounded-3xl border border-border bg-surface/60" />
            ))}
          </div>
        ) : (
          <>
            <section className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
              {movies.map((movie, index) => (
                <div key={movie.id} className="animate-[fade-in_0.5s_ease-out]" style={{ animationDelay: `${index * 40}ms` }}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </section>

            <footer className="flex flex-col items-center gap-4 rounded-3xl border border-border bg-surface/60 px-4 py-6 text-sm text-muted sm:flex-row sm:justify-between">
              <p>
                Página {page} de {totalPages}
              </p>
              <ReactPaginate
                breakLabel="..."
                nextLabel="Siguiente"
                onPageChange={({ selected }) => setPage(selected + 1)}
                pageRangeDisplayed={2}
                marginPagesDisplayed={1}
                pageCount={totalPages}
                previousLabel="Anterior"
                forcePage={page - 1}
                containerClassName="flex items-center gap-2"
                pageClassName=""
                pageLinkClassName="rounded-full border border-border px-3 py-2 transition hover:border-orange-400/40 hover:text-orange-200"
                activeClassName=""
                activeLinkClassName="rounded-full border border-orange-400/30 bg-orange-400/15 px-3 py-2 text-orange-100"
                previousLinkClassName="rounded-full border border-border px-3 py-2 transition hover:border-orange-400/40 hover:text-orange-200"
                nextLinkClassName="rounded-full border border-border px-3 py-2 transition hover:border-orange-400/40 hover:text-orange-200"
                disabledLinkClassName="cursor-not-allowed opacity-40"
                breakLinkClassName="px-2 text-muted"
              />
            </footer>
          </>
        )}
      </section>
    </main>
  );
}