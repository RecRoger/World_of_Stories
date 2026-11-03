import type { NextFunction, Request, Response } from 'express';
import { isValidObjectId } from 'mongoose';
import { AUTH_COOKIE, clearAuthCookie, verifyToken } from '../lib/auth.js';
import { User } from '../models/user.model.js';

/**
 * Si llega una cookie de sesión válida, carga el usuario en `req.user`.
 * No rechaza peticiones: el control de acceso lo hace cada ruta.
 */
export async function authenticate(req: Request, res: Response, next: NextFunction) {
  const token: unknown = req.cookies?.[AUTH_COOKIE];
  if (typeof token !== 'string') return next();

  const userId = verifyToken(token);
  const user = userId && isValidObjectId(userId) ? await User.findById(userId, 'username email role').lean() : null;
  if (!user) {
    clearAuthCookie(res);
    return next();
  }

  req.user = { id: user._id.toString(), username: user.username, email: user.email, roles: user.role };
  next();
}
