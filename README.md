# World of Stories

¡Aplicación de cuentos interactivos! Escritores amateur crean ciudades, lugares y personajes con historias
ramificadas en decisiones, y los lectores las recorren con sus propios personajes.

Monorepo con npm workspaces:

| Paquete | Contenido |
| --- | --- |
| [`server/`](server) | API REST (Express 5, MongoDB, zod) — ver su README |
| [`client/`](client) | Front React (Vite, React Router, TanStack Query, Tailwind + shadcn/ui) — ver su README |
| [`packages/shared/`](packages/shared) | Esquemas zod y tipos compartidos entre la API y el front |
| `Client_Side/` | Front Angular antiguo, solo como referencia de la funcionalidad a replicar en el nuevo front React |

```bash
npm install
npm run dev          # arranca la API (http://localhost:3000, docs en /docs)
npm run dev:client   # arranca el front (http://localhost:5173), en otra terminal
npm test             # tests de la API
```
