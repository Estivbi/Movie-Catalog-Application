import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.js';

export const usersRouter = Router();

usersRouter.get('/me', authMiddleware, async (request: AuthenticatedRequest, response) => {
  try {
    if (!request.user) {
      return response.status(401).json({ message: 'No autenticado' });
    }

    // Leemos el perfil y el contenido propio por separado para mantener filtros simples y evitar joins innecesarios.
    const [profileResult, commentsResult, ratingsResult] = await Promise.all([
      supabaseAdmin
        .from('profiles')
        .select('id, display_name, avatar_url')
        .eq('id', request.user.id)
        .maybeSingle(),
      supabaseAdmin
        .from('comments')
        .select('id, tmdb_movie_id, user_id, content, is_hidden, created_at')
        .eq('user_id', request.user.id)
        .order('created_at', { ascending: false }),
      supabaseAdmin
        .from('ratings')
        .select('id, tmdb_movie_id, user_id, score, created_at')
        .eq('user_id', request.user.id)
        .order('created_at', { ascending: false }),
    ]);

    if (profileResult.error) {
      return response.status(500).json({ message: 'No se pudo cargar el perfil' });
    }

    if (commentsResult.error) {
      return response.status(500).json({ message: 'No se pudieron cargar los comentarios' });
    }

    if (ratingsResult.error) {
      return response.status(500).json({ message: 'No se pudieron cargar los ratings' });
    }

    return response.json({
      profile: profileResult.data,
      comments: commentsResult.data ?? [],
      ratings: ratingsResult.data ?? [],
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado al cargar los datos del usuario';
    return response.status(500).json({ message });
  }
});