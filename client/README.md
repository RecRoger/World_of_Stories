# World of Stories — Front

React 19 + Vite + TypeScript. Rutas con React Router, datos del server con TanStack Query, formularios con
react-hook-form validados con los mismos esquemas zod de [`@wos/shared`](../packages/shared) que usa la API,
y estilos con Tailwind 4 + componentes estilo shadcn/ui adaptados al diseño de Claude Design.

```bash
npm run dev -w server   # la API tiene que estar levantada (puerto 3000)
npm run dev -w client   # http://localhost:5173
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
| `/acceso` (`?modo=registro`) | Iniciar sesión / Registrarse | solo sin sesión |
| `/inicio` | Leer o escribir | con sesión |
| `/leer`, `/escribir` | Próximamente | con sesión |
