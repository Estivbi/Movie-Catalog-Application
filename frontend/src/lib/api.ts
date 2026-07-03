// Punto de entrada único para comunicarse con el backend.
// Centralizar aquí evita que las páginas acumulen lógica de fetch dispersa.
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3001';

// ─── Tipos compartidos ────────────────────────────────────────────────────────

export interface MovieSummary {
  id:            number;
  title:         string;
  overview:      string;
  poster_path:   string | null;
  backdrop_path: string | null;
  release_date:  string;
  vote_average:  number;
}

export interface MovieDetail extends MovieSummary {
  runtime: number | null;
  genres:  Array<{ id: number; name: string }>;
}

export interface PopularMoviesResponse {
  page:          number;
  total_pages:   number;
  total_results: number;
  results:       MovieSummary[];
}

export interface MovieDetailResponse {
  movie:          MovieDetail;
  comments:       Comment[];
  rating_average: number | null;
  rating_count:   number;
}

export interface Comment {
  id:            string;
  tmdb_movie_id: string;
  user_id:       string;
  content:       string;
  is_hidden:     boolean;
  created_at:    string;
}

export interface Rating {
  id:            string;
  tmdb_movie_id: string;
  user_id:       string;
  score:         number;
  created_at:    string;
}

export interface Profile {
  id:           string;
  display_name: string | null;
  avatar_url:   string | null;
}

export interface UserProfileResponse {
  profile:  Profile | null;
  comments: Comment[];
  ratings:  Rating[];
}

// ─── Helper interno ───────────────────────────────────────────────────────────

async function apiFetch<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${apiBaseUrl}${path}`, options);

  if (!response.ok) {
    // Intentamos leer el mensaje que devuelve el backend; si falla usamos el status HTTP.
    const body = await response.json().catch(() => null) as { message?: string } | null;
    throw new Error(body?.message ?? `Error ${response.status}`);
  }

  // 204 No Content — no hay cuerpo que parsear.
  if (response.status === 204) return undefined as unknown as T;

  return response.json() as Promise<T>;
}

function authHeaders(token: string): HeadersInit {
  return {
    'Content-Type':  'application/json',
    'Authorization': `Bearer ${token}`,
  };
}

// ─── Películas (público) ──────────────────────────────────────────────────────

export function fetchPopularMovies(page: number): Promise<PopularMoviesResponse> {
  return apiFetch<PopularMoviesResponse>(`/movies?page=${page}`);
}

export function fetchMovieDetail(tmdbId: number | string): Promise<MovieDetailResponse> {
  return apiFetch<MovieDetailResponse>(`/movies/${tmdbId}`);
}

// ─── Comentarios (requiere token) ─────────────────────────────────────────────

export function postComment(
  tmdbMovieId: number | string,
  content: string,
  token: string,
): Promise<{ comment: Comment }> {
  return apiFetch('/comments', {
    method:  'POST',
    headers: authHeaders(token),
    body:    JSON.stringify({ tmdb_movie_id: String(tmdbMovieId), content }),
  });
}

export function putComment(
  commentId: string,
  content: string,
  token: string,
): Promise<{ comment: Comment }> {
  return apiFetch(`/comments/${commentId}`, {
    method:  'PUT',
    headers: authHeaders(token),
    body:    JSON.stringify({ content }),
  });
}

export function deleteComment(commentId: string, token: string): Promise<void> {
  return apiFetch(`/comments/${commentId}`, {
    method:  'DELETE',
    headers: authHeaders(token),
  });
}

// ─── Ratings (requiere token) ─────────────────────────────────────────────────

export function postRating(
  tmdbMovieId: number | string,
  score: number,
  token: string,
): Promise<{ rating: Rating }> {
  return apiFetch('/ratings', {
    method:  'POST',
    headers: authHeaders(token),
    body:    JSON.stringify({ tmdb_movie_id: String(tmdbMovieId), score }),
  });
}

// ─── Perfil del usuario (requiere token) ─────────────────────────────────────

export function fetchProfile(token: string): Promise<UserProfileResponse> {
  return apiFetch('/users/me', {
    headers: authHeaders(token),
  });
}

// ─── Admin (requiere token + email admin) ─────────────────────────────────────

export function fetchAdminComments(token: string): Promise<{ comments: Comment[] }> {
  return apiFetch('/admin/comments', {
    headers: authHeaders(token),
  });
}

export function toggleCommentVisibility(
  commentId: string,
  token: string,
): Promise<{ comment: Comment }> {
  return apiFetch(`/admin/comments/${commentId}`, {
    method:  'PATCH',
    headers: authHeaders(token),
  });
}