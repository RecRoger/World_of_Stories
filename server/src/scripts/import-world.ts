// Importa contenido generado (ver docs/guia-escritura-automatica.md). No borra nada.
//   npm run import:world -- <archivo.json>   mundo completo: ciudades → lugares → NPCs → capítulos
//   npm run import:city  -- <archivo.json>   una ciudad (nueva, o versiones nuevas de sus textos)
//   npm run import:place -- <archivo.json>   un lugar en una ciudad existente
//   npm run import:npc   -- <archivo.json>   un NPC con sus capítulos en un lugar existente
// Opciones: --publish, --dry-run, --strict, --author=<usuario> (por defecto TellerIA)
// Destino (lugar y NPC): --city=<ciudad> y --place=<lugar> mandan sobre lo que diga el archivo.
// Sin archivo, el lugar o el NPC lo escribe Claude a partir de la ciudad y el lugar de destino:
//   npm run import:place -- --city="Vado Ámbar" [--idea="…"]
//   npm run import:npc   -- --city="Vado Ámbar" --place="Puente de los faroleros" [--idea="…"]
import { access, mkdir, readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import mongoose from 'mongoose';
import { env } from '../config/env.js';
import { EFFORTS, claudeAsk, generateElement, GENERATION_MODEL, type Effort, type GenerateTarget } from '../import/generate.js';
import { ensureAuthor, GENERATED_AUTHOR, importWorld } from '../import/import-world.js';
import { IMPORT_KINDS, parseImportFile, type ImportKind, type Issue } from '../import/world-file.js';

const args = process.argv.slice(2);
const [kind, file] = args.filter((a) => !a.startsWith('--')) as [ImportKind | undefined, string | undefined];
const option = (name: string) => args.find((a) => a.startsWith(`--${name}=`))?.slice(name.length + 3).trim() || undefined;
const publish = args.includes('--publish');
const dryRun = args.includes('--dry-run');
const strict = args.includes('--strict');
const author = option('author') ?? GENERATED_AUTHOR;
const city = option('city');
const place = option('place');
const idea = option('idea');
const effort = (option('effort') ?? 'medium') as Effort;
const out = option('out');

const usage = (problem?: string) => {
  if (problem) console.error(`❌ ${problem}\n`);
  console.error('Uso: npm run import:<world|city|place|npc> -- <archivo.json> [opciones]');
  console.error('     npm run import:place -- --city=<ciudad> [--idea=<texto>]               (lo escribe Claude)');
  console.error('     npm run import:npc   -- --city=<ciudad> --place=<lugar> [--idea=<texto>] (lo escribe Claude)');
  console.error('  --publish        publica lo importado (si no, queda en borrador)');
  console.error('  --dry-run        solo valida, sin escribir en el juego');
  console.error('  --strict         los avisos de la guía también impiden importar');
  console.error(`  --author=<u>     autor de los relatos (por defecto ${GENERATED_AUTHOR}, que se crea si no existe)`);
  console.error('  --city=<c>       ciudad de destino del lugar o del NPC (manda sobre la del archivo)');
  console.error('  --place=<l>      lugar de destino del NPC (manda sobre el del archivo)');
  console.error('  --idea=<texto>   al generar: de qué trata el lugar o la historia del NPC');
  console.error(`  --effort=<e>     al generar: ${EFFORTS.join(' | ')} (por defecto medium)`);
  console.error('  --out=<archivo>  al generar: dónde guardar el JSON (por defecto docs/mundos/generados/)');
  process.exit(1);
};

if (!kind || !IMPORT_KINDS.includes(kind)) usage();
if ((city || place) && kind !== 'place' && kind !== 'npc') usage('--city y --place solo valen para import:place e import:npc');
if (place && kind === 'place') usage('Un lugar se crea en una ciudad: usa --city');
if (!EFFORTS.includes(effort)) usage(`--effort debe ser ${EFFORTS.join(', ')}`);
const generate = !file;
if (generate) {
  if (kind !== 'place' && kind !== 'npc') usage('Falta el archivo (solo los lugares y los NPCs se pueden generar sin archivo)');
  if (!city) usage(`Para generar ${kind === 'place' ? 'un lugar' : 'un NPC'} indica la ciudad con --city`);
  if (kind === 'npc' && !place) usage('Para generar un NPC indica también el lugar con --place');
}

const print = (issues: Issue[]) => {
  for (const level of ['error', 'warning'] as const) {
    const list = issues.filter((i) => i.level === level);
    if (!list.length) continue;
    console.log(level === 'error' ? `\n❌ ${list.length} error(es):` : `\n⚠️  ${list.length} aviso(s) de la guía:`);
    for (const i of list) console.log(`   ${i.path}: ${i.message}`);
  }
};

const slug = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '') || 'sin-nombre';

/** Guarda el JSON generado sin pisar otro archivo */
async function save(raw: Record<string, unknown>) {
  let target = out ? path.resolve(out) : '';
  if (!target) {
    const dir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../docs/mundos/generados');
    await mkdir(dir, { recursive: true });
    const base = path.join(dir, `${kind}-${slug(String(raw.name ?? ''))}`);
    target = `${base}.json`;
    for (let n = 2; await access(target).then(() => true, () => false); n++) target = `${base}-${n}.json`;
  }
  await writeFile(target, JSON.stringify(raw, null, 2) + '\n', 'utf8');
  return target;
}

async function main() {
  let raw: unknown;
  if (file) {
    try {
      raw = JSON.parse(await readFile(file, 'utf8'));
    } catch (err) {
      console.error(`❌ No se pudo leer ${file}: ${(err as Error).message}`);
      return 1;
    }
    // El destino de la línea de órdenes manda sobre el del archivo
    if (raw && typeof raw === 'object' && (city || place)) raw = { ...raw, ...(city ? { city } : {}), ...(place ? { place } : {}) };
  }

  await mongoose.connect(env.MONGODB_URI);
  try {
    if (author !== GENERATED_AUTHOR) await ensureAuthor(author);

    if (generate) {
      const target: GenerateTarget = kind === 'npc' ? { kind, city: city!, place: place! } : { kind: 'place', city: city! };
      console.log(`✍️  Escribiendo ${kind === 'place' ? `un lugar para «${city}»` : `un NPC para «${place}» de «${city}»`} con ${GENERATION_MODEL} (esfuerzo ${effort})…`);
      const result = await generateElement(target, {
        ask: await claudeAsk(effort, target.kind),
        idea,
        author,
        onAttempt: (n, issues) =>
          console.log(
            issues.length
              ? `   intento ${n}: ${issues.filter((i) => i.level === 'error').length} error(es), ${issues.filter((i) => i.level === 'warning').length} aviso(s)`
              : `   intento ${n}: sin problemas`,
          ),
      });
      raw = result.raw;
      console.log(`📄 Guardado en ${await save(result.raw)}`);
    }

    const { world, relabel, issues: lint } = parseImportFile(kind!, raw);
    print(lint);
    if (!world || lint.some((i) => i.level === 'error') || (strict && lint.length)) {
      console.log('\nNo se importó nada.');
      return 1;
    }

    // Primero se resuelve todo sin escribir; solo si no hay errores se crea el autor (TellerIA) y se importa
    const check = await importWorld(world, { author, publish, dryRun: true });
    print(relabel(check.issues));
    if (check.issues.length) {
      console.log('\nNo se importó nada.');
      return 1;
    }
    if (dryRun) {
      console.log('\n✅ El archivo es válido (--dry-run: no se escribió nada en el juego).');
      return 0;
    }
    if ((await ensureAuthor(author)).created) console.log(`👤 Creado el autor ${author}`);
    const { summary } = await importWorld(world, { author, publish });
    if (!summary) throw new Error('La importación no devolvió resultado');
    const list = (title: string, items: string[]) => items.length && console.log(`${title}\n${items.map((i) => `   · ${i}`).join('\n')}`);
    console.log(`\n✅ Importado ${publish ? 'y publicado' : 'como borrador'} (autor: ${author})`);
    list('Ciudades nuevas:', summary.cities.created);
    list('Ciudades con versiones nuevas:', summary.cities.extended);
    list('Lugares nuevos:', summary.places.created);
    list('Lugares con versiones nuevas:', summary.places.extended);
    list(`NPCs (${summary.chapters} capítulos en total):`, summary.npcs);
    return 0;
  } catch (err) {
    console.error(`❌ ${(err as Error).message}`);
    return 1;
  } finally {
    await mongoose.disconnect();
  }
}

process.exitCode = await main();
