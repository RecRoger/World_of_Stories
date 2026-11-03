# World of Stories

¡Aplicación de cuentos interactivos! Escritores amateur crean ciudades, lugares y personajes con historias
ramificadas en decisiones, y los lectores las recorren con sus propios personajes.

Monorepo con npm workspaces:

| Paquete | Contenido |
| --- | --- |
| [`server/`](server) | API REST (Express 5, MongoDB, zod) — ver su README |
| [`packages/shared/`](packages/shared) | Esquemas zod y tipos compartidos entre la API y el front |
| `Client_Side/` | Front Angular antiguo, solo como referencia de la funcionalidad a replicar en el nuevo front React |

```bash
npm install
npm run dev        # arranca la API
npm test           # tests de la API
```
