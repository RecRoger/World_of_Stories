import { Router, type Request, type Response } from 'express';
import { z, type ZodType } from 'zod';
import type { Role } from '@wos/shared';
import { HttpError } from './http-error.js';

export interface AuthUser {
  id: string;
  username: string;
  email: string;
  roles: Role[];
}

declare module 'express-serve-static-core' {
  interface Request {
    user?: AuthUser;
  }
}

/** public: cualquiera · user: sesión iniciada · writer: Writer o Admin · admin: solo Admin */
export type Access = 'public' | 'user' | 'writer' | 'admin';
type Method = 'get' | 'post' | 'put' | 'patch' | 'delete';

const emptyObject = z.object({});
type EmptySchema = typeof emptyObject;

export interface RouteSpec<A extends Access, P extends ZodType, Q extends ZodType, B extends ZodType> {
  method: Method;
  /** Ruta relativa al prefijo del router, con sintaxis de Express (`/:id`) */
  path: string;
  summary: string;
  description?: string;
  access?: A;
  params?: P;
  query?: Q;
  body?: B;
  /** Esquema de la respuesta; solo se usa para documentar */
  response?: ZodType;
  /** Código de éxito (200 por defecto; 204 si el handler no devuelve nada) */
  status?: number;
}

export interface RouteContext<A extends Access, P extends ZodType, Q extends ZodType, B extends ZodType> {
  params: z.output<P>;
  query: z.output<Q>;
  body: z.output<B>;
  user: A extends 'public' ? AuthUser | undefined : AuthUser;
  req: Request;
  res: Response;
}

export interface RegisteredRoute {
  method: Method;
  path: string;
  tag: string;
  spec: RouteSpec<Access, ZodType, ZodType, ZodType>;
}

/** Todas las rutas declaradas, para generar el documento OpenAPI */
export const routeRegistry: RegisteredRoute[] = [];

export const isWriter = (user?: AuthUser) => !!user?.roles.some((r) => r === 'Writer' || r === 'Admin');
export const isAdmin = (user?: AuthUser) => !!user?.roles.includes('Admin');

function checkAccess(access: Access, user?: AuthUser) {
  if (access === 'public') return;
  if (!user) throw HttpError.unauthorized();
  if (access === 'writer' && !isWriter(user)) throw HttpError.forbidden('Solo los escritores pueden hacer esto');
  if (access === 'admin' && !isAdmin(user)) throw HttpError.forbidden('Solo los administradores pueden hacer esto');
}

function parse<S extends ZodType>(schema: S, value: unknown, where: string): z.output<S> {
  const result = schema.safeParse(value ?? {});
  if (!result.success) {
    throw HttpError.badRequest(`Datos inválidos en ${where}`, z.flattenError(result.error));
  }
  return result.data;
}

/**
 * Router de Express que valida params/query/body con zod, controla el acceso por rol
 * y registra cada ruta para la documentación OpenAPI.
 */
export class ApiRouter {
  readonly router = Router();

  constructor(
    readonly prefix: string,
    readonly tag: string,
  ) {}

  route<
    A extends Access = 'public',
    P extends ZodType = EmptySchema,
    Q extends ZodType = EmptySchema,
    B extends ZodType = EmptySchema,
  >(spec: RouteSpec<A, P, Q, B>, handler: (ctx: RouteContext<A, P, Q, B>) => Promise<unknown> | unknown) {
    const access: Access = spec.access ?? 'public';
    routeRegistry.push({
      method: spec.method,
      path: this.prefix + (spec.path === '/' ? '' : spec.path),
      tag: this.tag,
      spec: spec as unknown as RouteSpec<Access, ZodType, ZodType, ZodType>,
    });

    this.router[spec.method](spec.path, async (req: Request, res: Response) => {
      checkAccess(access, req.user);
      const ctx = {
        params: parse(spec.params ?? emptyObject, req.params, 'la ruta'),
        query: parse(spec.query ?? emptyObject, req.query, 'la query'),
        body: parse(spec.body ?? emptyObject, req.body, 'el body'),
        user: req.user,
        req,
        res,
      } as RouteContext<A, P, Q, B>;

      const result = await handler(ctx);
      if (res.headersSent) return;
      if (result === undefined) {
        res.status(204).end();
      } else {
        res.status(spec.status ?? 200).json(result);
      }
    });
    return this;
  }
}
