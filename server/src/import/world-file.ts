import { z } from 'zod';
import { ANIMATIONS } from '@wos/shared';

/*
 * Formato de los archivos de mundo generados automáticamente (ver docs/guia-escritura-automatica.md).
 *
 * - `worldFileSchema` valida la ESTRUCTURA: lo que la API necesita para guardarlo. Si falla, no se importa nada.
 * - `lintWorld` revisa las PAUTAS de la guía (palabras, párrafos, caracteres, árbol de capítulos, estilo):
 *   errores si la historia no se puede leer de principio a fin; avisos si se sale de los rangos recomendados.
 */

const text = z.string().trim().min(1, 'No puede estar vacío');
/** Un párrafo = un fragmento de lectura */
const paragraph = text.max(5000, 'Máximo 5000 caracteres por párrafo');
const paragraphs = z.array(paragraph).min(1, 'Se necesita al menos un párrafo').max(200);

/** Párrafo de capítulo: texto (animación "Normal") o `{ text, animation }` para elegir otra */
const fragment = z.union([paragraph, z.object({ text: paragraph, animation: z.enum(ANIMATIONS) })]);

const option = z.object({
  name: text.max(80, 'Máximo 80 caracteres'),
  description: text.max(500, 'Máximo 500 caracteres'),
});

const chapter = z.object({
  /** Clave local del capítulo, para que las opciones apunten a él (no se guarda) */
  id: text,
  name: text.max(80, 'Máximo 80 caracteres'),
  text: z.array(fragment).min(1, 'Se necesita al menos un párrafo').max(200),
  /** Sin opciones, el capítulo es final */
  options: z.array(option.extend({ to: text })).max(10).optional(),
  /** Dónde termina un capítulo final (por nombre). Por defecto, el lugar del NPC */
  end: z.object({ city: text.optional(), place: text.optional() }).optional(),
});

const npc = z.object({
  name: text.max(80, 'Máximo 80 caracteres'),
  title: text.max(120).optional(),
  description: paragraph,
  meeting: paragraphs,
  accept: option,
  reject: option,
  rejected: paragraphs,
  /** El primero es el capítulo inicial */
  chapters: z.array(chapter).min(1, 'Un NPC de historia necesita al menos un capítulo'),
});

/*
 * Las versiones de los textos de ciudades y lugares son obligatorias solo para crearlos: si ya existen
 * (mismo nombre), pueden venir vacías y se usan tal cual (p. ej. para añadirles un NPC).
 */
const place = z.object({
  name: text.max(80, 'Máximo 80 caracteres'),
  /** Versiones de la descripción (una se muestra al azar): un párrafo cada una */
  descriptions: z.array(paragraph).default([]),
  /** Versiones de la entrada: varios párrafos cada una */
  entries: z.array(paragraphs).default([]),
  npcs: z.array(npc).default([]),
});

const city = z.object({
  name: text.max(80, 'Máximo 80 caracteres'),
  descriptions: z.array(paragraph).default([]),
  travels: z.array(paragraphs).default([]),
  places: z.array(place).default([]),
});

export const worldFileSchema = z.object({ cities: z.array(city).min(1, 'El archivo necesita al menos una ciudad') });
export type WorldFile = z.output<typeof worldFileSchema>;

/*
 * Archivos por separado. Se convierten en un mundo con una sola rama, así que se validan e importan igual.
 * - Ciudad: la ciudad (sus `places` son opcionales).
 * - Lugar: el lugar y `city`, el nombre de su ciudad (que debe existir).
 * - NPC: el NPC con sus capítulos, `city` y `place` (que deben existir).
 */
export const cityFileSchema = city;
export const placeFileSchema = place.extend({ city: text });
export const npcFileSchema = npc.extend({ city: text, place: text });

export const IMPORT_KINDS = ['world', 'city', 'place', 'npc'] as const;
export type ImportKind = (typeof IMPORT_KINDS)[number];

/** Ruta, dentro del mundo, de lo que trae cada tipo de archivo (se quita de los mensajes) */
const PREFIX: Record<ImportKind, string> = {
  world: '',
  city: 'cities[0]',
  place: 'cities[0].places[0]',
  npc: 'cities[0].places[0].npcs[0]',
};

/** Valida un archivo de cualquier tipo y lo devuelve como mundo. Los mensajes usan rutas del propio archivo. */
export function parseImportFile(kind: ImportKind, raw: unknown): { world?: WorldFile; relabel: (issues: Issue[]) => Issue[]; issues: Issue[] } {
  const prefix = PREFIX[kind];
  // La ciudad y el lugar de un archivo suelto son solo referencias: sus errores apuntan a los campos `city` y `place`
  const parents: Record<string, string> = kind === 'npc' ? { 'cities[0]': 'city', 'cities[0].places[0]': 'place' } : kind === 'place' ? { 'cities[0]': 'city' } : {};
  const relabel = (issues: Issue[]) =>
    issues.map((i) => {
      if (parents[i.path]) return { ...i, path: parents[i.path]!, message: i.message.replace(/: para crear.*$/, '') };
      const path = !prefix ? i.path : i.path === prefix ? '(archivo)' : i.path.startsWith(`${prefix}.`) ? i.path.slice(prefix.length + 1) : i.path;
      return { ...i, path };
    });
  const toWorld = (): { success: true; data: WorldFile } | { success: false; error: z.ZodError } => {
    if (kind === 'world') {
      const r = worldFileSchema.safeParse(raw);
      return r.success ? { success: true, data: r.data } : { success: false, error: r.error };
    }
    if (kind === 'city') {
      const r = cityFileSchema.safeParse(raw);
      return r.success ? { success: true, data: { cities: [r.data] } } : { success: false, error: r.error };
    }
    if (kind === 'place') {
      const r = placeFileSchema.safeParse(raw);
      if (!r.success) return { success: false, error: r.error };
      const { city: cityName, ...p } = r.data;
      return { success: true, data: { cities: [{ name: cityName, descriptions: [], travels: [], places: [p] }] } };
    }
    const r = npcFileSchema.safeParse(raw);
    if (!r.success) return { success: false, error: r.error };
    const { city: cityName, place: placeName, ...n } = r.data;
    return {
      success: true,
      data: { cities: [{ name: cityName, descriptions: [], travels: [], places: [{ name: placeName, descriptions: [], entries: [], npcs: [n] }] }] },
    };
  };
  const parsed = toWorld();
  // Los errores de un archivo suelto ya tienen sus propias rutas
  if (!parsed.success) return { relabel, issues: schemaIssues(parsed.error) };
  return { world: parsed.data, relabel, issues: relabel(lintWorld(parsed.data)) };
}
export type WorldChapter = WorldFile['cities'][number]['places'][number]['npcs'][number]['chapters'][number];

export type Issue = { level: 'error' | 'warning'; path: string; message: string };

/** Rangos de la guía: [mínimo, máximo] */
export const RULES = {
  cityWords: [1, 3],
  placeWords: [1, 4],
  npcWords: [2, 6],
  descriptionChars: 300,
  travel: { paragraphs: [4, 8], chars: [1000, 4000] },
  entry: { paragraphs: [3, 6], chars: [900, 3000] },
  meeting: { paragraphs: [3, 8], chars: [900, 5000] },
  rejected: { paragraphs: [3, 6] },
  chapter: { paragraphs: [6, 18], chars: [1000, 12000] },
  optionDescriptionChars: 250,
  /** Capítulos desde el inicio hasta un final, ambos incluidos */
  storyLength: [3, 10],
} as const;

const words = (s: string) => s.trim().split(/\s+/).filter(Boolean).length;
const chars = (list: string[]) => list.reduce((n, p) => n + p.length, 0);
const fragmentText = (f: z.output<typeof fragment>) => (typeof f === 'string' ? f : f.text);

/**
 * Diálogo directo del Peregrino: una cita seguida de un verbo de habla en segunda persona
 * («…», dices / —…— respondes). La guía pide respuestas indirectas: «Cuentas tu historia».
 */
const PILGRIM_SPEECH = /[»—]\s*,?\s*(dices|respondes|preguntas|exclamas|susurras|contestas|gritas|murmuras|añades)\b/i;
/** Otros indicios de que no está en presente o habla en primera persona */
const FIRST_PERSON = /\b(yo|me acerqué|entré|caminé|vi|sentí|llegué)\b/i;

/** Revisa un archivo de mundo con las pautas de la guía. */
export function lintWorld(world: WorldFile): Issue[] {
  const issues: Issue[] = [];
  const error = (path: string, message: string) => issues.push({ level: 'error', path, message });
  const warn = (path: string, message: string) => issues.push({ level: 'warning', path, message });

  const nameWords = (path: string, name: string, [min, max]: readonly [number, number]) => {
    const n = words(name);
    if (n < min || n > max) warn(path, `El nombre tiene ${n} palabras (entre ${min} y ${max})`);
  };
  const oneParagraph = (path: string, p: string) => {
    if (/\n\s*\n/.test(p)) warn(path, 'Debe ser un solo párrafo');
    if (p.length > RULES.descriptionChars) warn(path, `${p.length} caracteres (máximo ${RULES.descriptionChars})`);
  };
  const narrative = (
    path: string,
    list: string[],
    range: { paragraphs: readonly [number, number]; chars?: readonly [number, number] },
  ) => {
    const [pMin, pMax] = range.paragraphs;
    if (list.length < pMin || list.length > pMax) warn(path, `${list.length} párrafos (entre ${pMin} y ${pMax})`);
    if (range.chars) {
      const [cMin, cMax] = range.chars;
      const n = chars(list);
      if (n < cMin || n > cMax) warn(path, `${n} caracteres (entre ${cMin} y ${cMax} aprox.)`);
    }
    list.forEach((p, i) => {
      if (PILGRIM_SPEECH.test(p)) warn(`${path}[${i}]`, 'Posible diálogo directo del Peregrino: usa respuestas indirectas («Le cuentas…»)');
      // los personajes sí hablan en primera persona: solo se mira la narración sin diálogos
      if (!/[«—"]/.test(p) && FIRST_PERSON.test(p)) warn(`${path}[${i}]`, 'Posible primera persona o pasado: la voz es omnisciente, en presente y en segunda persona');
    });
  };
  const endsInDecision = (path: string, list: string[]) => {
    const last = list.at(-1) ?? '';
    if (!last.includes('?')) warn(path, 'Debería terminar en una pregunta o una situación de decisión (no hay «?» en el último párrafo)');
  };
  const optionText = (path: string, o: { description: string }) => {
    if (o.description.length > RULES.optionDescriptionChars) {
      warn(`${path}.description`, `${o.description.length} caracteres (máximo ${RULES.optionDescriptionChars})`);
    }
  };

  const cityNames = new Set<string>();
  world.cities.forEach((c, ci) => {
    const cp = `cities[${ci}]`;
    if (cityNames.has(c.name.toLowerCase())) error(cp, `Ciudad repetida en el archivo: «${c.name}»`);
    cityNames.add(c.name.toLowerCase());
    nameWords(`${cp}.name`, c.name, RULES.cityWords);
    c.descriptions.forEach((d, i) => oneParagraph(`${cp}.descriptions[${i}]`, d));
    c.travels.forEach((t, i) => narrative(`${cp}.travels[${i}]`, t, RULES.travel));

    const placeNames = new Set<string>();
    c.places.forEach((p, pi) => {
      const pp = `${cp}.places[${pi}]`;
      if (placeNames.has(p.name.toLowerCase())) error(pp, `Lugar repetido en «${c.name}»: «${p.name}»`);
      placeNames.add(p.name.toLowerCase());
      nameWords(`${pp}.name`, p.name, RULES.placeWords);
      p.descriptions.forEach((d, i) => oneParagraph(`${pp}.descriptions[${i}]`, d));
      p.entries.forEach((e, i) => narrative(`${pp}.entries[${i}]`, e, RULES.entry));

      p.npcs.forEach((n, ni) => {
        const np = `${pp}.npcs[${ni}]`;
        nameWords(`${np}.name`, n.name, RULES.npcWords);
        oneParagraph(`${np}.description`, n.description);
        narrative(`${np}.meeting`, n.meeting, RULES.meeting);
        endsInDecision(`${np}.meeting`, n.meeting);
        optionText(`${np}.accept`, n.accept);
        optionText(`${np}.reject`, n.reject);
        narrative(`${np}.rejected`, n.rejected, RULES.rejected);
        lintChapters(np, n.chapters, { error, warn, narrative, endsInDecision, optionText });
      });
    });
  });
  return issues;
}

type Checks = {
  error: (path: string, message: string) => void;
  warn: (path: string, message: string) => void;
  narrative: (path: string, list: string[], range: { paragraphs: readonly [number, number]; chars?: readonly [number, number] }) => void;
  endsInDecision: (path: string, list: string[]) => void;
  optionText: (path: string, o: { description: string }) => void;
};

/** El árbol de capítulos: referencias válidas, sin ciclos, todo alcanzable y recorridos de 3 a 10 capítulos. */
function lintChapters(np: string, chapters: WorldChapter[], c: Checks) {
  const byId = new Map<string, number>();
  chapters.forEach((ch, i) => {
    if (byId.has(ch.id)) c.error(`${np}.chapters[${i}].id`, `Clave de capítulo repetida: «${ch.id}»`);
    byId.set(ch.id, i);
  });

  chapters.forEach((ch, i) => {
    const path = `${np}.chapters[${i}]`;
    const options = ch.options ?? [];
    const texts = ch.text.map(fragmentText);
    c.narrative(`${path}.text`, texts, RULES.chapter);
    if (options.length) {
      if (options.length !== 2) c.warn(`${path}.options`, `${options.length} opciones (la guía pide 2)`);
      c.endsInDecision(`${path}.text`, texts);
      if (ch.end) c.warn(`${path}.end`, 'Un capítulo con opciones no es final: se ignora `end`');
    }
    options.forEach((o, oi) => {
      c.optionText(`${path}.options[${oi}]`, o);
      if (!byId.has(o.to)) c.error(`${path}.options[${oi}].to`, `No existe el capítulo «${o.to}»`);
      else if (o.to === ch.id) c.error(`${path}.options[${oi}].to`, 'Una opción no puede llevar a su propio capítulo');
    });
  });

  // Recorridos desde el inicio: detecta ciclos y mide cada camino hasta un final
  const [min, max] = RULES.storyLength;
  const reached = new Set<string>();
  const lengths: number[] = [];
  let cycle = false;
  const walk = (id: string, trail: string[]) => {
    const i = byId.get(id);
    if (i === undefined) return;
    if (trail.includes(id)) {
      cycle = true;
      return;
    }
    reached.add(id);
    const options = chapters[i]!.options ?? [];
    if (!options.length) lengths.push(trail.length + 1);
    // Los árboles de la guía son pequeños; el tope evita explosiones con archivos mal formados
    if (lengths.length < 5000) for (const o of options) walk(o.to, [...trail, id]);
  };
  if (chapters[0]) walk(chapters[0].id, []);

  if (cycle) c.error(`${np}.chapters`, 'Hay un ciclo: alguna decisión vuelve a un capítulo anterior y la historia podría no terminar');
  if (!lengths.length) c.error(`${np}.chapters`, 'Ningún recorrido llega a un capítulo final (sin opciones)');
  chapters.forEach((ch, i) => {
    if (!reached.has(ch.id)) c.warn(`${np}.chapters[${i}]`, `«${ch.name}» no se alcanza desde el capítulo inicial`);
  });
  const short = lengths.filter((n) => n < min).length;
  const long = lengths.filter((n) => n > max).length;
  if (short) c.warn(`${np}.chapters`, `${short} recorrido(s) con menos de ${min} capítulos hasta un final`);
  if (long) c.warn(`${np}.chapters`, `${long} recorrido(s) con más de ${max} capítulos hasta un final`);
}

/** Convierte los errores de zod en el mismo formato que `lintWorld`. */
export function schemaIssues(err: z.ZodError): Issue[] {
  return err.issues.map((i) => ({ level: 'error', path: i.path.map((p) => (typeof p === 'number' ? `[${p}]` : `.${String(p)}`)).join('').replace(/^\./, ''), message: i.message }));
}
