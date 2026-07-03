import type { NextFunction, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    email?: string;
  };
}

// Extrae el JWT, lo valida contra Supabase y deja el usuario resuelto en req.user.
export async function authMiddleware(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  const authHeader = request.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    return response.status(401).json({ message: 'Falta el token de autorización' });
  }

  const token = authHeader.slice('Bearer '.length);
  const { data, error } = await supabaseAdmin.auth.getUser(token);

  if (error || !data.user) {
    return response.status(401).json({ message: 'Token inválido o expirado' });
  }

  request.user = {
    id: data.user.id,
    email: data.user.email ?? undefined,
  };

  return next();
}