const tmdbBaseUrl = 'https://api.themoviedb.org/3';

export interface TmdbMovieSummary {
  id: number;
  title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
}

export interface TmdbPopularResponse {
  page: number;
  total_pages: number;
  total_results: number;
  results: TmdbMovieSummary[];
}

export interface TmdbMovieDetail extends TmdbMovieSummary {
  runtime: number | null;
  genres: Array<{ id: number; name: string }>;
}

function getTmdbToken() {
  const token = process.env.TMDB_API_READ_TOKEN;

  if (!token) {
    throw new Error('Falta TMDB_API_READ_TOKEN en el entorno');
  }

  return token;
}

async function tmdbFetch<T>(path: string, searchParams: Record<string, string | number | undefined> = {}): Promise<T> {
  const url = new URL(`${tmdbBaseUrl}${path}`);

  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined) {
      url.searchParams.set(key, String(value));
    }
  }

  // Construimos la URL con query params explícitos para que la paginación y los filtros sean predecibles.
  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${getTmdbToken()}`,
      Accept: 'application/json',
    },
  });

  // TMDB suele devolver JSON con mensaje de error; lo normalizamos para no filtrar detalles crudos al cliente.
  if (!response.ok) {
    const errorBody = await response.text();
    throw new Error(`TMDB respondió ${response.status}: ${errorBody}`);
  }

  return response.json() as Promise<T>;
}

export function getPopularMovies(page: number) {
  return tmdbFetch<TmdbPopularResponse>('/movie/popular', {
    language: 'es-ES',
    page,
  });
}

export function getMovieDetail(tmdbId: string) {
  return tmdbFetch<TmdbMovieDetail>(`/movie/${tmdbId}`, {
    language: 'es-ES',
  });
}