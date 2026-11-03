export class HttpError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'HttpError';
  }

  static badRequest(message: string, details?: unknown) {
    return new HttpError(400, 'BAD_REQUEST', message, details);
  }
  static unauthorized(message = 'Necesitas iniciar sesión') {
    return new HttpError(401, 'UNAUTHORIZED', message);
  }
  static forbidden(message = 'No tienes permisos para esta acción') {
    return new HttpError(403, 'FORBIDDEN', message);
  }
  static notFound(message: string) {
    return new HttpError(404, 'NOT_FOUND', message);
  }
  static conflict(message: string) {
    return new HttpError(409, 'CONFLICT', message);
  }
}

/** Devuelve el valor o lanza 404 si es null/undefined */
export function found<T>(value: T, message: string): NonNullable<T> {
  if (value == null) throw HttpError.notFound(message);
  return value;
}
