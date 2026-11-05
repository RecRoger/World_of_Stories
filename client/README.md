# World of Stories — Front

React 19 + Vite + TypeScript. Rutas con React Router, datos del server con TanStack Query, formularios con
react-hook-form validados con los mismos esquemas zod de [`@wos/shared`](../packages/shared) que usa la API,
y estilos con Tailwind 4 + componentes estilo shadcn/ui adaptados al diseño de Claude Design.

```bash
npm run dev -w server   # la API tiene que estar levantada (puerto 3000)
npm run dev -w client   # http://localhost:4200
```

En desarrollo, Vite redirige `/api` a `localhost:3000`, así la cookie de sesión es del mismo origen.
En producción, sirve `dist/` desde el mismo dominio que la API o define `VITE_API_URL` (ver `.env.example`).

## Estructura

```
src/
  main.tsx              QueryClient + RouterProvider
  router.tsx            mapa de rutas y qué guard protege cada una
  lib/api.ts            fetch con cookie, errores como ApiError y validación zod de la respuesta
  features/auth/        hooks de sesión (useMe, useLogin, useRegister, useLogout) y guards de rutas
  components/ui/        piezas base (Button, Input, Label, Paper) — estilo shadcn, con los tokens del diseño
  components/layout/    marco de página (cabecera + contenido) y loader
  components/form/      Field y mapeo de errores del server a campos
  pages/                una pantalla por archivo
  styles/               tokens de Tailwind (@theme) y fuentes autoalojadas
```

| Ruta | Pantalla | Acceso |
| --- | --- | --- |
| `/` | Landing | pública |
| `/access` (`?mode=register`) | Iniciar sesión / Registrarse | solo sin sesión |
| `/home` | Leer o escribir | con sesión |
| `/read` | Próximamente | con sesión |
| `/write/join` | Entrada para escritores (código de invitación) | con sesión |
| `/write/cities` (`/write` redirige aquí) | Ciudades | Writer o Admin |
| `/write/cities/:cityId/places` | Lugares de una ciudad | Writer o Admin |
| `/write/cities/:cityId/places/:placeId/events` | Eventos y NPCs de un lugar | Writer o Admin |
| `/write/cities/:cityId/places/:placeId/npcs/:npcId/chapters` | Próximamente (Capítulos) | Writer o Admin |

Ciudades y Lugares funcionan igual y comparten componentes (`features/locations/`): la creación es un modal y
cada tarjeta gestiona en el sitio el nombre y sus extractos (descripciones y viajes/entradas, en pestañas con
carrusel). Lo que cambia entre ambas se describe en `resource.ts`. Cualquier escritor añade extractos; editar, publicar y
eliminar un extracto o la ciudad es solo para su autor o un admin.

Todas las rutas de `/write/*` comparten `WriterLayout`, con el acceso a **Sugerencias de escritura** bajo el logo.
Las acciones de editar, publicar y eliminar solo aparecen para el autor (`createdBy`) o un admin (`canManage` en
`features/auth/roles.ts`); el server vuelve a comprobar los permisos en cada petición.
