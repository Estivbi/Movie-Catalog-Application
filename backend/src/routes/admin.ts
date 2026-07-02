import { Router } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { authMiddleware, type AuthenticatedRequest } from '../middleware/auth.js';
import { adminMiddleware } from '../middleware/admin.js';

export const adminRouter = Router();

adminRouter.use(authMiddleware, adminMiddleware);

adminRouter.get('/comments', async (_request, response) => {
  try {
    // El panel de moderación necesita ver todo el contenido para poder filtrar y ocultar sin duplicar lógica.
    const { data, error } = await supabaseAdmin
      .from('comments')
      .select('id, tmdb_movie_id, user_id, content, is_hidden, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      return response.status(500).json({ message: 'No se pudieron cargar los comentarios' });
    }

    return response.json({ comments: data ?? [] });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado al cargar comentarios de admin';
    return response.status(500).json({ message });
  }
});

adminRouter.patch('/comments/:id', async (request: AuthenticatedRequest, response) => {
  try {
    const { id } = request.params;

    // El toggle se calcula en servidor para evitar que el cliente imponga estados inconsistentes.
    const { data: currentComment, error: lookupError } = await supabaseAdmin
      .from('comments')
      .select('id, is_hidden')
      .eq('id', id)
      .maybeSingle();

    if (lookupError) {
      return response.status(500).json({ message: 'No se pudo revisar el comentario' });
    }

    if (!currentComment) {
      return response.status(404).json({ message: 'Comentario no encontrado' });
    }

    const { data, error } = await supabaseAdmin
      .from('comments')
      .update({ is_hidden: !currentComment.is_hidden })
      .eq('id', id)
      .select('id, tmdb_movie_id, user_id, content, is_hidden, created_at')
      .single();

    if (error || !data) {
      return response.status(500).json({ message: 'No se pudo actualizar la visibilidad' });
    }

    return response.json({ comment: data });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Error inesperado al alternar la visibilidad';
    return response.status(500).json({ message });
  }
});