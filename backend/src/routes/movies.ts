import { Router } from 'express';
import { getPopularMovies } from '../services/tmdb.js';

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