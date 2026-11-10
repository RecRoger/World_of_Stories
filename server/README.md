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
| `npm run seed:example -- <usuario> --yes` | **Borra todas las ciudades, lugares y NPCs** y crea un mundo de ejemplo a nombre de `<usuario>` |

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

## Modo lector y modo escritor

Ciudades y lugares se listan de dos formas, con respuestas distintas (y documentadas por separado en `/docs`):

| Modo | Rutas | Respuesta |
| --- | --- | --- |
| Lector (público) | `GET /cities`, `GET /cities/:cityId/places` | Solo lo publicado, con **una versión publicada al azar** de cada relato (`CityReading`, `PlaceReading`). Igual para todos los usuarios. |
| Escritor | `GET /writer/cities`, `GET /writer/cities/:cityId/places`, `GET /writer/places/:placeId/npcs`, `GET /writer/npcs/:npcId/chapters` | La información completa: todas las versiones, también las sin publicar (`City`, `Place`). Filtrable con `?published`. |

Los NPCs son de tipo `story`, `store` o `travel`. Uno de tipo `story` con decisión `choose` tiene **exactamente dos
opciones**: la primera acepta la historia y la segunda la rechaza (la API lo valida al crear y al editar).
Aceptar lleva siempre al capítulo inicial, que se crea vacío («Inicio») junto con el NPC; rechazar no lleva a ninguno.

### Capítulos

- Se crean desde las decisiones: al editar un capítulo, una opción sin `value` crea un capítulo nuevo y vacío con su nombre;
  con `value` apunta a un capítulo existente del mismo NPC. Un capítulo sin decisiones es final y termina en `endLocation`.
- **Publicar** un capítulo publica en cadena los capítulos sin publicar a los que llevan sus decisiones (y los siguientes).
  Hay que tener permiso sobre todos; si no, no se publica ninguno (403).
- **Borrar** un capítulo quita las opciones que llevaban a él. El capítulo inicial no se borra.
- Un NPC de tipo `story` **solo se publica con todos sus capítulos publicados** (409 con los que faltan).
- Para los lectores, las opciones que llevan a un capítulo sin publicar quedan ocultas.

## Formato de errores

```json
{ "error": { "code": "BAD_REQUEST", "message": "Datos inválidos en el body", "details": { "fieldErrors": { "name": ["..."] } } } }
```
