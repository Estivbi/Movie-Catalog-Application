import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.js';

export const commentsRouter = Router();

commentsRouter.post('/', authMiddleware, async (request: AuthenticatedRequest, response) => {
  try {
    const { tmdb_movie_id: tmdbMovieId, content } = request.body as {
      tmdb_movie_id?: string | number;
      content?: string;
    };

    if (!request.user) {
      return response.status(401).json({ message: 'No autenticado' });
    }

    const normalizedMovieId = typeof tmdbMovieId === 'number' ? String(tmdbMovieId) : tmdbMovieId?.trim();

    if (!normalizedMovieId || !/^\d+$/.test(normalizedMovieId)) {
      return response.status(400).json({ message: 'tmdb_movie_id debe ser numérico' });
    }

    const normalizedContent = content?.trim();

    if (!normalizedContent) {
      return response.status(400).json({ message: 'content es obligatorio' });
    }

    // Insertamos solo el texto y la relación con TMDB; el usuario viene resuelto por el JWT.
    const { data, error } = await supabaseAdmin
      .from('comments')
      .insert({
        tmdb_movie_id: normalizedMovieId,
        user_id: request.user.id,
        content: normalizedContent,
        is_hidden: false,
      })
      .select('id, tmdb_movie_id, user_id, content, is_hidden, created_at')
      .single();

    if (error || !data) {
      return response.status(500).json({ message: 'No se pudo crear el comentario' });
    }

    return response.status(201).json({ comment: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado al crear el comentario';
    return response.status(500).json({ message });
  }
});

commentsRouter.put('/:id', authMiddleware, async (request: AuthenticatedRequest, response) => {
  try {
    const { id } = request.params;
    const { content } = request.body as { content?: string };

    if (!request.user) {
      return response.status(401).json({ message: 'No autenticado' });
    }

    const normalizedContent = content?.trim();

    if (!normalizedContent) {
      return response.status(400).json({ message: 'content es obligatorio' });
    }

    // Filtramos por id y user_id para impedir edición de comentarios ajenos aunque se conozca el identificador.
    const { data, error } = await supabaseAdmin
      .from('comments')
      .update({ content: normalizedContent })
      .eq('id', id)
      .eq('user_id', request.user.id)
      .select('id, tmdb_movie_id, user_id, content, is_hidden, created_at')
      .single();

    if (error || !data) {
      return response.status(404).json({ message: 'Comentario no encontrado o sin permisos' });
    }

    return response.json({ comment: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado al editar el comentario';
    return response.status(500).json({ message });
  }
});

commentsRouter.delete('/:id', authMiddleware, async (request: AuthenticatedRequest, response) => {
  try {
    const { id } = request.params;

    if (!request.user) {
      return response.status(401).json({ message: 'No autenticado' });
    }

    // La condición por user_id evita borrados cruzados y deja el borrado acotado al autor.
    const { error } = await supabaseAdmin
      .from('comments')
      .delete()
      .eq('id', id)
      .eq('user_id', request.user.id);

    if (error) {
      return response.status(500).json({ message: 'No se pudo borrar el comentario' });
    }

    return response.status(204).send();
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado al borrar el comentario';
    return response.status(500).json({ message });
  }
});