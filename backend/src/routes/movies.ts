import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { getPopularMovies } from '../services/tmdb.js';
import { getMovieDetail } from '../services/tmdb.js';

export const moviesRouter = Router();

moviesRouter.get('/', async (request, response) => {
  try {
    const page = Number(request.query.page ?? 1);

    // Esta ruta delega la paginación a TMDB para no duplicar datos en la base.
    const popularMovies = await getPopularMovies(Number.isFinite(page) && page > 0 ? page : 1);

    return response.json({
      page: popularMovies.page,
      total_pages: popularMovies.total_pages,
      total_results: popularMovies.total_results,
      results: popularMovies.results,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado al cargar películas';
    return response.status(502).json({ message });
  }
});

moviesRouter.get('/:tmdbId', async (request, response) => {
  try {
    const { tmdbId } = request.params;

    if (!/^\d+$/.test(tmdbId)) {
      return response.status(400).json({ message: 'El identificador de TMDB debe ser numérico' });
    }

    // Leemos el detalle desde TMDB y los datos propios desde Supabase en paralelo para reducir latencia.
    const [movieDetail, commentsResult, ratingsResult] = await Promise.all([
      getMovieDetail(tmdbId),
      supabaseAdmin
        .from('comments')
        .select('id, tmdb_movie_id, user_id, content, is_hidden, created_at')
        .eq('tmdb_movie_id', tmdbId)
        .eq('is_hidden', false)
        .order('created_at', { ascending: false }),
      supabaseAdmin
        .from('ratings')
        .select('score')
        .eq('tmdb_movie_id', tmdbId),
    ]);

    if (commentsResult.error) {
      return response.status(500).json({ message: 'No se pudieron cargar los comentarios' });
    }

    if (ratingsResult.error) {
      return response.status(500).json({ message: 'No se pudieron cargar los ratings' });
    }

    const ratings = ratingsResult.data ?? [];
    const averageRating = ratings.length
      ? ratings.reduce((total, rating) => total + rating.score, 0) / ratings.length
      : null;

    return response.json({
      movie: movieDetail,
      comments: commentsResult.data ?? [],
      rating_average: averageRating,
      rating_count: ratings.length,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado al cargar el detalle';
    return response.status(502).json({ message });
  }
});