import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.js';

export const ratingsRouter = Router();

ratingsRouter.post('/', authMiddleware, async (request: AuthenticatedRequest, response) => {
  try {
    const { tmdb_movie_id: tmdbMovieId, score } = request.body as {
      tmdb_movie_id?: string | number;
      score?: number;
    };

    if (!request.user) {
      return response.status(401).json({ message: 'No autenticado' });
    }

    const normalizedMovieId = typeof tmdbMovieId === 'number' ? String(tmdbMovieId) : tmdbMovieId?.trim();

    if (!normalizedMovieId || !/^\d+$/.test(normalizedMovieId)) {
      return response.status(400).json({ message: 'tmdb_movie_id debe ser numérico' });
    }

    const normalizedScore = Number(score);

    if (!Number.isInteger(normalizedScore) || normalizedScore < 1 || normalizedScore > 5) {
      return response.status(400).json({ message: 'score debe estar entre 1 y 5' });
    }

    // Buscamos primero el rating del usuario para mantener una sola valoración por película.
    const { data: existingRating, error: lookupError } = await supabaseAdmin
      .from('ratings')
      .select('id')
      .eq('tmdb_movie_id', normalizedMovieId)
      .eq('user_id', request.user.id)
      .maybeSingle();

    if (lookupError) {
      return response.status(500).json({ message: 'No se pudo revisar el rating existente' });
    }

    const mutation = existingRating
      ? supabaseAdmin
          .from('ratings')
          .update({ score: normalizedScore })
          .eq('id', existingRating.id)
          .eq('user_id', request.user.id)
          .select('id, tmdb_movie_id, user_id, score, created_at')
          .single()
      : supabaseAdmin
          .from('ratings')
          .insert({
            tmdb_movie_id: normalizedMovieId,
            user_id: request.user.id,
            score: normalizedScore,
          })
          .select('id, tmdb_movie_id, user_id, score, created_at')
          .single();

    const { data, error } = await mutation;

    if (error || !data) {
      return response.status(500).json({ message: 'No se pudo guardar el rating' });
    }

    return response.status(existingRating ? 200 : 201).json({ rating: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado al guardar el rating';
    return response.status(500).json({ message });
  }
});