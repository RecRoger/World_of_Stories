import type { z } from 'zod';
import { apiErrorSchema } from '@wos/shared';

const BASE_URL = `${import.meta.env.VITE_API_URL ?? ''}/api/v1`;

/** Error de la API con el formato `{ error: { code, message, details } }` del server. */
export class ApiError extends Error {
  constructor(
    public readonly status: number,
    public readonly code: string,
    message: string,
    public readonly details?: unknown,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

type RequestOptions<S extends z.ZodType | undefined> = {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  body?: unknown;
  /** Esquema de `@wos/shared` con el que se valida (y tipa) la respuesta. */
  schema?: S;
  signal?: AbortSignal;
};

type Result<S> = S extends z.ZodType ? z.output<S> : void;

/**
 * Cliente HTTP mínimo: envía la cookie de sesión, serializa el body, convierte los errores en `ApiError`
 * y valida la respuesta con el mismo esquema zod que usa el server para documentarla.
 */
export async function api<S extends z.ZodType | undefined = undefined>(
  path: string,
  { method = 'GET', body, schema, signal }: RequestOptions<S> = {},
): Promise<Result<S>> {
  let res: Response;
  try {
    res = await fetch(BASE_URL + path, {
      method,
      signal,
      credentials: 'include',
      headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch (err) {
    if (signal?.aborted) throw err;
    throw new ApiError(0, 'NETWORK', 'No se pudo conectar con el servidor');
  }

  const data: unknown = res.status === 204 ? undefined : await res.json().catch(() => undefined);

  if (!res.ok) {
    const parsed = apiErrorSchema.safeParse(data);
    if (parsed.success) {
      const { code, message, details } = parsed.data.error;
      throw new ApiError(res.status, code, message, details);
    }
    throw new ApiError(res.status, 'UNKNOWN', 'Algo salió mal, inténtalo de nuevo');
  }

  return (schema ? schema.parse(data) : undefined) as Result<S>;
}
