// Escribe openapi.json (p. ej. para generar clientes): npm run openapi
import { writeFileSync } from 'node:fs';
import { createApp, API_PREFIX } from '../app.js';
import { buildOpenApiDocument } from '../lib/openapi.js';

createApp(); // registra todas las rutas
const out = new URL('../../openapi.json', import.meta.url);
writeFileSync(out, JSON.stringify(buildOpenApiDocument(API_PREFIX), null, 2));
console.log(`✅ ${out.pathname}`);
