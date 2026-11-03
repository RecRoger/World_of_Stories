import type { ErrorRequestHandler, RequestHandler } from 'express';
import mongoose from 'mongoose';
import type { ApiError } from '@wos/shared';
import { HttpError } from '../lib/http-error.js';
import { isProduction } from '../config/env.js';

export const notFound: RequestHandler = (req, _res, next) => {
  next(HttpError.notFound(`No existe la ruta ${req.method} ${req.path}`));
};

function toHttpError(err: unknown): HttpError {
  if (err instanceof HttpError) return err;
  if (err instanceof mongoose.Error.CastError) {
    return HttpError.badRequest(`Valor inválido para "${err.path}"`);
  }
  if (err instanceof mongoose.Error.ValidationError) {
    return HttpError.badRequest(
      'Datos inválidos',
      Object.fromEntries(Object.entries(err.errors).map(([k, v]) => [k, v.message])),
    );
  }
  if (typeof err === 'object' && err && 'code' in err && err.code === 11000) {
    const field = Object.keys((err as { keyValue?: object }).keyValue ?? {})[0] ?? 'campo';
    return HttpError.conflict(`Ya existe un registro con ese ${field}`);
  }
  // JSON mal formado en el body
  if (typeof err === 'object' && err && 'type' in err && err.type === 'entity.parse.failed') {
    return HttpError.badRequest('El body no es un JSON válido');
  }
  return new HttpError(500, 'INTERNAL', 'Error interno del servidor');
}

export const errorHandler: ErrorRequestHandler = (err, req, res, _next) => {
  const httpError = toHttpError(err);
  if (httpError.status >= 500) {
    req.log?.error({ err }, 'Error no controlado');
  }
  const body: ApiError = {
    error: {
      code: httpError.code,
      message: httpError.message,
      details: httpError.details ?? (!isProduction && httpError.status >= 500 ? String(err) : undefined),
    },
  };
  res.status(httpError.status).json(body);
};
