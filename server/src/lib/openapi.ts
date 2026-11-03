import { z, type ZodType } from 'zod';
import { apiErrorSchema } from '@wos/shared';
import { routeRegistry } from './route.js';

type JsonSchema = Record<string, unknown>;

const STATUS_TEXT: Record<number, string> = {
  200: 'OK',
  201: 'Creado',
  204: 'Sin contenido',
  400: 'Datos inválidos',
  401: 'Sin sesión',
  403: 'Sin permisos',
  404: 'No encontrado',
  409: 'Conflicto',
};

/**
 * Convierte un esquema zod a JSON Schema; los esquemas con `.meta({ id })` se mueven a
 * `components.schemas` y se referencian con `$ref`.
 */
function toSchema(schema: ZodType, io: 'input' | 'output', components: Record<string, JsonSchema>): JsonSchema {
  const json = z.toJSONSchema(schema, { io, unrepresentable: 'any', target: 'draft-2020-12' }) as JsonSchema;
  const text = JSON.stringify(json).replaceAll('"#/$defs/', '"#/components/schemas/');
  const { $defs, $schema: _, ...rest } = JSON.parse(text) as JsonSchema & { $defs?: Record<string, JsonSchema> };
  for (const [id, def] of Object.entries($defs ?? {})) components[id] ??= def;
  // un esquema con id propio se devuelve como referencia
  const id = z.globalRegistry.get(schema)?.id;
  if (id) {
    components[id] ??= rest;
    return { $ref: `#/components/schemas/${id}` };
  }
  return rest;
}

/** Convierte un esquema de objeto en parámetros OpenAPI (path o query) */
function toParameters(schema: ZodType | undefined, location: 'path' | 'query', components: Record<string, JsonSchema>) {
  if (!schema) return [];
  const json = toSchema(schema, 'input', components) as { properties?: Record<string, JsonSchema>; required?: string[] };
  return Object.entries(json.properties ?? {}).map(([name, prop]) => ({
    name,
    in: location,
    required: location === 'path' || (json.required ?? []).includes(name),
    schema: prop,
    ...(typeof prop.description === 'string' ? { description: prop.description } : {}),
  }));
}

export function buildOpenApiDocument(serverUrl = '/api/v1') {
  const components: Record<string, JsonSchema> = {};
  const errorRef = toSchema(apiErrorSchema, 'output', components);
  const paths: Record<string, Record<string, unknown>> = {};

  for (const { method, path, tag, spec } of routeRegistry) {
    const openApiPath = path.replace(/:(\w+)/g, '{$1}');
    const access = spec.access ?? 'public';
    const status = spec.status ?? (spec.response ? 200 : 204);

    const errorCodes = [400, ...(access === 'public' ? [] : [401]), ...(access === 'writer' || access === 'admin' ? [403] : []), 404];
    const responses: Record<string, unknown> = {
      [status]: {
        description: STATUS_TEXT[status] ?? 'OK',
        ...(spec.response ? { content: { 'application/json': { schema: toSchema(spec.response, 'output', components) } } } : {}),
      },
    };
    for (const code of errorCodes) {
      responses[code] = { description: STATUS_TEXT[code], content: { 'application/json': { schema: errorRef } } };
    }

    const accessNote = { public: '', user: 'Requiere sesión.', writer: 'Requiere rol Writer o Admin.', admin: 'Requiere rol Admin.' }[access];
    (paths[openApiPath] ??= {})[method] = {
      tags: [tag],
      summary: spec.summary,
      description: [spec.description, accessNote].filter(Boolean).join('\n\n') || undefined,
      parameters: [...toParameters(spec.params, 'path', components), ...toParameters(spec.query, 'query', components)],
      ...(spec.body
        ? { requestBody: { required: true, content: { 'application/json': { schema: toSchema(spec.body, 'input', components) } } } }
        : {}),
      ...(access === 'public' ? {} : { security: [{ cookieAuth: [] }] }),
      responses,
    };
  }

  return {
    openapi: '3.1.0',
    info: {
      title: 'World of Stories API',
      version: '2.0.0',
      description:
        'API de historias interactivas. Inicia sesión con `POST /auth/login`: la sesión queda en la cookie httpOnly `wos_token`.',
    },
    servers: [{ url: serverUrl }],
    paths,
    components: {
      schemas: components,
      securitySchemes: { cookieAuth: { type: 'apiKey', in: 'cookie', name: 'wos_token' } },
    },
  };
}
