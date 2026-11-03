# World of Stories — API

Express 5 + Mongoose 8 + zod 4, en TypeScript (ESM). Los esquemas de entrada/salida viven en
[`@wos/shared`](../packages/shared) y se usan a la vez para validar, tipar y generar la documentación.

## Puesta en marcha

```bash
cp .env.example .env        # y pon un JWT_SECRET propio
npm install                 # desde la raíz del monorepo
npm run dev                 # http://localhost:3000/api/v1 · docs en /docs
```

| Script | Qué hace |
| --- | --- |
| `npm run dev` | Servidor con recarga (tsx watch) |
| `npm run build` / `npm start` | Bundle de producción en `dist/` y arranque |
| `npm test` | Tests de integración contra `world_of_stories_test` en tu Mongo local (`TEST_MONGODB_URI` para otra) |
| `npm run typecheck` | Comprobación de tipos |
| `npm run openapi` | Exporta `openapi.json` (también se sirve en `/openapi.json`) |
| `npm run set-roles -- <usuario> Admin Writer` | Asigna roles desde la terminal (p. ej. tu primer admin) |

## Estructura

```
src/
  app.ts               middlewares y montaje de routers
  server.ts            conexión a Mongo, arranque y apagado limpio
  config/env.ts        variables de entorno validadas con zod
  lib/route.ts         ApiRouter: valida params/query/body, controla el acceso y registra la ruta en OpenAPI
  lib/openapi.ts       genera el documento OpenAPI 3.1 a partir de los esquemas zod
  middleware/          sesión (cookie JWT) y manejo de errores
  models/              esquemas de Mongoose (compatibles con los datos existentes)
  modules/             rutas por recurso: auth, me, users, cities, places, npcs, chapters
```

Para añadir un endpoint, declara la ruta con `api.route({ method, path, access, params, query, body, response }, handler)`:
el handler recibe los datos ya validados y tipados, y lo que devuelva se envía como JSON.

## Autenticación y roles

- `POST /auth/register` y `POST /auth/login` dejan la sesión en la cookie httpOnly `wos_token`; `POST /auth/logout` la borra.
- **Reader** (por defecto): lee lo publicado y gestiona sus personajes en `/me/characters`.
- **Writer**: crea y edita el mundo; ve borradores. Se obtiene con `POST /me/become-writer` y el `WRITER_INVITE_CODE`.
- **Admin**: puede con todo, incluida la gestión de usuarios en `/users`.
- Cada versión de un relato solo la edita su autor (o un admin). El contenido sin autor (datos antiguos) lo puede editar cualquier escritor.

## Formato de errores

```json
{ "error": { "code": "BAD_REQUEST", "message": "Datos inválidos en el body", "details": { "fieldErrors": { "name": ["..."] } } } }
```
