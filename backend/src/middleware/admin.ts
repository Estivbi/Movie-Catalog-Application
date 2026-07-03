import type { NextFunction, Response } from 'express';
import type { AuthenticatedRequest } from './auth.js';

function getAdminEmail() {
  const adminEmail = process.env.ADMIN_EMAIL;

  if (!adminEmail) {
    throw new Error('Falta ADMIN_EMAIL en el entorno');
  }

  return adminEmail;
}

// Solo el email configurado en entorno puede entrar.
export function adminMiddleware(request: AuthenticatedRequest, response: Response, next: NextFunction) {
  if (!request.user?.email) {
    return response.status(401).json({ message: 'No autenticado' });
  }

  if (request.user.email !== getAdminEmail()) {
    return response.status(403).json({ message: 'No tienes permisos de administrador' });
  }

  return next();
}