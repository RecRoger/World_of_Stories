import type { CookieOptions, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { env, isProduction } from '../config/env.js';

export const AUTH_COOKIE = 'wos_token';
const SALT_ROUNDS = 12;

const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: 'lax',
  path: '/',
};

export function setAuthCookie(res: Response, userId: string) {
  const token = jwt.sign({}, env.JWT_SECRET, {
    subject: userId,
    expiresIn: `${env.JWT_EXPIRES_IN_DAYS}d`,
  });
  res.cookie(AUTH_COOKIE, token, { ...cookieOptions, maxAge: env.JWT_EXPIRES_IN_DAYS * 24 * 60 * 60 * 1000 });
}

export function clearAuthCookie(res: Response) {
  res.clearCookie(AUTH_COOKIE, cookieOptions);
}

/** Devuelve el ID de usuario si el token es válido, o null */
export function verifyToken(token: string): string | null {
  try {
    const payload = jwt.verify(token, env.JWT_SECRET);
    return typeof payload === 'object' && payload.sub ? payload.sub : null;
  } catch {
    return null;
  }
}

export const hashPassword = (password: string) => bcrypt.hash(password, SALT_ROUNDS);
export const checkPassword = (password: string, hash: string) => bcrypt.compare(password, hash);
