# Instrucciones para agentes de IA

Monorepo de **World of Stories**: `server/` (API Express + MongoDB), `client/` (React + Vite, puerto 4200) y
`packages/shared` (esquemas comunes). Detalles en [`README.md`](README.md).

## Crear contenido del juego

Cuando te pidan crear, generar o escribir una **ciudad, un lugar, un NPC (evento con sus capítulos) o un mundo**,
sigue el procedimiento de [`.claude/skills/crear-contenido/SKILL.md`](.claude/skills/crear-contenido/SKILL.md):
reúne el contexto del destino con el script de importación, escribe tú el JSON, valídalo con `--dry-run`, corrige e
impórtalo. No le pidas al usuario que copie o pegue archivos.

Lo esencial:

- Scripts desde `server/`: `node --import tsx src/scripts/import-world.ts <world|city|place|npc> [archivo.json] [opciones]`.
- Pauta y formato: [`docs/guia-escritura-automatica.md`](docs/guia-escritura-automatica.md) y
  [`docs/plantillas/`](docs/plantillas/).
- Lo generado se firma como **TellerIA** y se importa en borrador, salvo que pidan publicarlo (`--publish`).
- No uses `--claude` (API de pago) salvo que el usuario lo pida.
- No dejes archivos en el proyecto: el encargo y el JSON van a la carpeta temporal (`--workdir` la muestra) y el
  script los borra al importar con éxito.

## Convenciones

- Rutas y código en inglés; textos de la interfaz y documentación en español.
- No hagas commits ni toques git salvo que el usuario lo pida.
