import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import { Button } from '../components/ui/button';
import { Skeleton } from '../components/ui/skeleton';
import { MovieCard } from '../components/movies/MovieCard';
import { fetchPopularMovies, type MovieSummary } from '../lib/api';

export function HomePage() {
  const [page, setPage] = useState(1);
  const [reloadToken, setReloadToken] = useState(0);
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
  }, [page, reloadToken]);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(255,255,255,0.08),_transparent_28%),radial-gradient(circle_at_right,_rgba(249,115,22,0.14),_transparent_24%),linear-gradient(180deg,#050505_0%,#090909_48%,#020202_100%)] px-4 py-6 text-white sm:px-6 lg:px-10">
      <section className="mx-auto flex w-full max-w-7xl flex-col gap-8">
        <header className="relative overflow-hidden rounded-[2.25rem] border border-white/10 bg-[linear-gradient(135deg,rgba(255,255,255,0.06),rgba(255,255,255,0.02))] p-6 shadow-[0_28px_100px_rgba(0,0,0,0.45)] sm:p-8 lg:p-10">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.08),transparent_30%),radial-gradient(circle_at_right,rgba(249,115,22,0.1),transparent_24%)]" />

          <div className="relative flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl space-y-6">
              <div className="space-y-4">
                <h1 className="max-w-4xl text-4xl font-semibold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
                  Películas.
                </h1>
              </div>
            </div>
          </div>
        </header>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-100">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p>{error}</p>
              <Button variant="outline" size="sm" onClick={() => setReloadToken((currentToken) => currentToken + 1)}>
                Reintentar
              </Button>
            </div>
          </div>
        ) : null}

        {loading ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={index} className="h-[540px] rounded-[1.8rem]" />
            ))}
          </div>
        ) : (
          <>
            <section className="space-y-5">
              <div className="flex items-end justify-between gap-4">
                <div>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white">Películas populares</h2>
                </div>
                <p className="hidden text-sm text-white/45 sm:block">Desliza y cambia de página cuando quieras.</p>
              </div>

              <div className="-mx-4 overflow-x-auto px-4 pb-2 sm:-mx-6 sm:px-6">
                <div className="grid w-max grid-flow-col auto-cols-[170px] gap-4 sm:auto-cols-[200px] lg:auto-cols-[220px]">
                  {movies.map((movie, index) => (
                    <div key={movie.id} className="animate-[fade-in_0.5s_ease-out]" style={{ animationDelay: `${index * 45}ms` }}>
                      <MovieCard movie={movie} />
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <footer className="flex flex-col items-center gap-4 rounded-[2rem] border border-white/10 bg-black/20 px-4 py-6 text-sm text-white/72 backdrop-blur-md sm:flex-row sm:justify-between">
              <p className="text-white/45">
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
                pageLinkClassName="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                activeClassName=""
                activeLinkClassName="rounded-full border border-white/20 bg-white/12 px-3 py-2 text-white"
                previousLinkClassName="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                nextLinkClassName="rounded-full border border-white/10 bg-white/[0.03] px-3 py-2 transition hover:border-white/25 hover:bg-white/[0.08] hover:text-white"
                disabledLinkClassName="cursor-not-allowed opacity-40"
                breakLinkClassName="px-2 text-white/30"
              />
            </footer>
          </>
        )}
      </section>
    </main>
  );
}
