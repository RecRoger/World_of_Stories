import { rateLimit } from 'express-rate-limit';
import { loginInputSchema, registerInputSchema, userSchema, type User as UserDto } from '@wos/shared';
import { ApiRouter } from '../lib/route.js';
import { HttpError } from '../lib/http-error.js';
import { checkPassword, clearAuthCookie, hashPassword, setAuthCookie } from '../lib/auth.js';
import { env } from '../config/env.js';
import { User } from '../models/user.model.js';

export const authApi = new ApiRouter('/auth', 'Auth');

// Frena ataques de fuerza bruta sobre login/registro
authApi.router.use(
  rateLimit({ windowMs: 15 * 60 * 1000, limit: env.NODE_ENV === 'test' ? 1000 : 20, standardHeaders: 'draft-8', legacyHeaders: false }),
);

authApi
  .route(
    {
      method: 'post',
      path: '/register',
      summary: 'Crear cuenta e iniciar sesión',
      description: 'Las cuentas nuevas son lectoras. Para escribir, usa `POST /me/become-writer`.',
      body: registerInputSchema,
      response: userSchema,
      status: 201,
    },
    async ({ body, res }) => {
      const exists = await User.findOne({ $or: [{ username: body.username }, { email: body.email }] }, 'username').lean();
      if (exists) {
        throw HttpError.conflict(exists.username === body.username ? 'El username ya está registrado' : 'El email ya está registrado');
      }
      const user = await User.create({ ...body, password: await hashPassword(body.password), role: ['Reader'] });
      setAuthCookie(res, user.id);
      return user.toJSON() as unknown as UserDto;
    },
  )
  .route(
    {
      method: 'post',
      path: '/login',
      summary: 'Iniciar sesión con username o email',
      description: 'Deja la sesión en una cookie httpOnly (`wos_token`).',
      body: loginInputSchema,
      response: userSchema,
    },
    async ({ body, res }) => {
      const identifier = body.identifier.trim();
      const user = await User.findOne({ $or: [{ username: identifier }, { email: identifier.toLowerCase() }] }).select('+password');
      // Mismo mensaje en ambos casos para no revelar qué cuentas existen
      if (!user || !(await checkPassword(body.password, user.password))) {
        throw HttpError.unauthorized('Usuario o contraseña incorrectos');
      }
      setAuthCookie(res, user.id);
      return user.toJSON() as unknown as UserDto;
    },
  )
  .route({ method: 'post', path: '/logout', summary: 'Cerrar sesión' }, ({ res }) => {
    clearAuthCookie(res);
  });
