const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

export interface MovieSummary {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface PopularMoviesResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: MovieSummary[];
}

// Centralizamos la URL del backend para que toda la UI hable con la misma puerta de entrada.
export async function fetchPopularMovies(page: number) {
  const response = await fetch(`${apiBaseUrl}/movies?page=${page}`);

  if (!response.ok) {
    throw new Error('No se pudieron cargar las películas. Revisa que el backend esté levantado en la URL configurada.');
  }

  return response.json() as Promise<PopularMoviesResponse>;
}