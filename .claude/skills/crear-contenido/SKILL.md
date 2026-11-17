---
name: crear-contenido
description: Escribe e importa contenido narrativo de World of Stories (ciudades, lugares, NPCs con sus capítulos o un mundo completo) siguiendo la guía de escritura, sin pasos manuales. Úsala cuando el usuario pida crear, generar o escribir una ciudad, un lugar, un NPC, un evento, una historia o un mundo para el juego (p. ej. «crea un NPC en el Puente de los faroleros de Vado Ámbar»).
---

# Crear contenido para World of Stories

Tú escribes el contenido (no la API de Claude) y lo importas con los scripts del server. El usuario no copia ni pega
nada: el ciclo encargo → JSON → validación → importación lo haces tú.

**No dejes archivos en el proyecto.** El encargo y el JSON van a la carpeta temporal de trabajo, fuera del repositorio
(`node --import tsx src/scripts/import-world.ts --workdir` la imprime; en Windows, `%TEMP%\world-of-stories`). Al importar con
éxito, el script borra de esa carpeta el JSON importado y los encargos de su destino. No escribas nada en `docs/`.

## Antes de empezar

- Qué crear y dónde: tipo (`city`, `place`, `npc`, `world`), ciudad y lugar de destino, y la idea si la dio.
  Si falta el destino de un lugar o un NPC, pregúntalo. Si no hay idea, elígela tú, acorde al destino.
- **Publicar o no:** por defecto se importa **en borrador**. Solo usa `--publish` si el usuario lo pidió.
- Firma: **TellerIA** (por defecto; no pases `--author` salvo que lo pidan).
- No uses `--claude` (cuesta dinero por la API) salvo que el usuario lo pida explícitamente.
- Si el usuario quiere conservar los archivos, añade `--keep` al importar (o guárdalos donde diga).
- Necesitas MongoDB accesible (la `MONGODB_URI` de `server/.env`); el server web no hace falta.

## Comandos

Ejecútalos **desde `server/`** y llamando al script directamente (en PowerShell `npm run` se traga las opciones que
van tras `--`, y en Windows `npx tsx` se cuelga con algunos `--idea` largos con acentos; `node --import tsx` no).
El primer argumento es el tipo:

```
node --import tsx src/scripts/import-world.ts <world|city|place|npc> [archivo.json] [opciones]
```

Entrecomilla los nombres con espacios o acentos: `--city="Vado Ámbar"`. En los ejemplos, `<tmp>` es la carpeta
temporal de trabajo.

## Procedimiento

### 1. Reunir el contexto

**Lugar o NPC:** genera el encargo, que trae la guía, la plantilla, la idea y el contexto real del destino leído de la
base (textos de la ciudad y del lugar, lo que ya existe allí para no repetirlo y, para un NPC, los destinos posibles
de sus finales):

```
node --import tsx src/scripts/import-world.ts npc --city="<ciudad>" --place="<lugar>" --idea="<idea>"
node --import tsx src/scripts/import-world.ts place --city="<ciudad>" --idea="<idea>"
```

Imprime la ruta del encargo (`<tmp>/<tipo>-<slug>.md`). **Léelo entero**: es tu encargo. Si el script dice que la
ciudad o el lugar no existen, díselo al usuario con los nombres que sí existen (si los da) y para.

**Ciudad o mundo:** no hay encargo. Lee `docs/guia-escritura-automatica.md` entera y la plantilla
(`docs/plantillas/ciudad.json` o `docs/plantillas/mundo.json`). Si un nombre de ciudad ya existe, el importador
**añade versiones** a esa ciudad en lugar de crear otra: si se quiere una ciudad nueva, comprueba los nombres
en la base (con la API levantada, `GET http://localhost:3000/api/v1/cities`; si no, el encargo de un lugar en una
ciudad que no existe falla y lista las que sí existen).

### 2. Planificar (sin escribir prosa)

Como pide la guía (sección 7): primero el plan. Para un NPC, su conflicto y el árbol de capítulos (nombre y resumen de
una línea de cada uno, a dónde lleva cada opción y dónde termina cada final). Comprueba que cumple la sección 3 de la
guía (recorridos de 3–10 capítulos, dos opciones por decisión, todo camino llega a un final, sin ciclos).
Si el usuario pidió revisar el plan, enséñaselo y espera; si no, sigue.

### 3. Escribir el JSON

Escríbelo en `<tmp>/<tipo>-<slug-del-nombre>.json`, con el formato de la plantilla del tipo. Respeta la voz (segunda
persona, presente, el Peregrino nunca habla en directo), los límites de caracteres y párrafos de cada campo y las
animaciones de la guía. Escribe capítulo a capítulo siguiendo el árbol.

### 4. Validar y corregir

```
node --import tsx src/scripts/import-world.ts <tipo> "<tmp>/<archivo>.json" --city="<ciudad>" [--place="<lugar>"] --dry-run
```

- **Errores** (❌): no se importa nada. Corrige exactamente los campos señalados y vuelve a validar.
- **Avisos** (⚠️): se salen de la guía. Corrígelos también; si alguno es deliberado, explica por qué al final.
- Repite hasta que salga `✅ El archivo es válido`. Con `--dry-run` no se borra nada.

### 5. Importar

El mismo comando sin `--dry-run` (y con `--publish` solo si lo pidieron). Comprueba que imprime `✅ Importado…` y
`🧹 Borrados de la carpeta temporal: …`. Si la importación falla, los archivos se quedan para corregir y reintentar;
si abandonas la tarea, bórralos tú de `<tmp>`.

### 6. Informar

Di en pocas líneas qué se creó y dónde (nombre, ciudad y lugar, número de capítulos y finales), si quedó en borrador
o publicado y los avisos que se mantuvieron. En borrador se revisa y publica desde la sección de escritor (`/write`);
los relatos de TellerIA los gestiona un admin.
