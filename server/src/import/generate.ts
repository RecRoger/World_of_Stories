// Genera un lugar o un NPC con Claude a partir de lo que ya hay en el juego (ver docs/guia-escritura-automatica.md)
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Anthropic from '@anthropic-ai/sdk';
import { City, type CityDoc } from '../models/city.model.js';
import { Npc } from '../models/npc.model.js';
import type { ITale } from '../models/tale.model.js';
import { importWorld } from './import-world.js';
import { parseImportFile, type Issue, type WorldFile } from './world-file.js';

export const GENERATION_MODEL = 'claude-opus-5-5';
export const EFFORTS = ['low', 'medium', 'high', 'xhigh', 'max'] as const;
export type Effort = (typeof EFFORTS)[number];

/** Dónde se crea el elemento: un lugar en una ciudad, o un NPC en un lugar */
export type GenerateTarget = { kind: 'place'; city: string } | { kind: 'npc'; city: string; place: string };

const docs = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../../../docs');
const TEMPLATE = { place: 'lugar.json', npc: 'npc.json' } as const;

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();
const tale = (v: ITale) => v.tale.map((f) => f.text).join('\n\n');
/** Las versiones publicadas (o todas, si ninguna lo está) */
const versions = (list: ITale[]) => {
  const published = list.filter((v) => v.published);
  return (published.length ? published : list).map(tale);
};
const numbered = (title: string, list: string[]) =>
  list.length ? list.map((t, i) => `### ${title}${list.length > 1 ? ` (versión ${i + 1})` : ''}\n${t}`).join('\n\n') : '';

/**
 * Lee de la base la ciudad (y el lugar) de destino y lo resume para el modelo: sus textos, lo que ya existe
 * alrededor (para no repetirlo) y los destinos posibles de los finales.
 */
export async function loadContext(target: GenerateTarget): Promise<{ context: string; city: CityDoc } | { issue: Issue }> {
  const city = (await City.find()).find((c) => same(c.name, target.city));
  if (!city) return { issue: { level: 'error', path: 'city', message: `No existe la ciudad «${target.city}»` } };

  const parts = [`## La ciudad: ${city.name}`, numbered('Descripción', versions(city.description)), numbered('Viaje de llegada', versions(city.travel))];
  const others = city.places.filter((p) => target.kind === 'place' || !same(p.name, target.place));
  if (others.length) {
    parts.push(
      `## ${target.kind === 'place' ? 'Lugares que ya existen en la ciudad (no los repitas)' : 'Otros lugares de la ciudad'}`,
      others.map((p) => `- **${p.name}**: ${versions(p.description)[0] ?? ''}`).join('\n'),
    );
  }

  if (target.kind === 'npc') {
    const place = city.places.find((p) => same(p.name, target.place));
    if (!place) return { issue: { level: 'error', path: 'place', message: `No existe el lugar «${target.place}» en «${city.name}»` } };
    parts.push(`## El lugar: ${place.name}`, numbered('Descripción', versions(place.description)), numbered('Entrada', versions(place.entry)));
    const npcs = await Npc.find({ _id: { $in: place.events } });
    if (npcs.length) {
      parts.push(
        '## NPCs que ya están en el lugar (crea uno distinto)',
        npcs.map((n) => `- **${n.name}**${n.title ? ` (${n.title})` : ''}: ${n.description ? tale(n.description) : ''}`).join('\n'),
      );
    }
    const cities = (await City.find({}, { name: 1, places: 1 })).filter((c) => !c._id.equals(city._id));
    parts.push(
      '## Destinos posibles para los finales',
      `Por defecto, un final vuelve a «${place.name}». También puede terminar en otro lugar de ${city.name} (\`"end": { "place": "…" }\`)` +
        (cities.length
          ? ` o en otra ciudad: ${cities.map((c) => `${c.name} (${c.places.map((p) => p.name).join(', ') || 'sin lugares'})`).join('; ')}.`
          : '.'),
    );
  }
  return { context: parts.filter(Boolean).join('\n\n'), city };
}

/** Pide un mensaje al modelo; se puede sustituir en los tests */
export type Ask = (messages: Anthropic.Beta.BetaMessageParam[]) => Promise<Anthropic.Beta.BetaMessage>;

export async function claudeAsk(effort: Effort, kind: GenerateTarget['kind']): Promise<Ask> {
  const client = new Anthropic();
  const [guide, template] = await Promise.all([
    readFile(path.join(docs, 'guia-escritura-automatica.md'), 'utf8'),
    readFile(path.join(docs, 'plantillas', TEMPLATE[kind]), 'utf8'),
  ]);
  const system = [
    'Eres escritor de World of Stories, un juego de lectura en el que el Peregrino viaja por ciudades y lugares y se encuentra con NPCs que le cuentan historias.',
    'Escribe en español, como narrador omnisciente, en presente, dirigiéndote al Peregrino en segunda persona y sin darle diálogo directo, siguiendo al pie de la letra la guía y el formato de la plantilla.',
    'Lo que escribas debe tener sentido en el lugar donde se crea: usa la ciudad y el lugar que se te describen (su historia, sus oficios, su clima, sus nombres) y no repitas lo que ya existe.',
    'Responde solo con el JSON, sin comentarios ni texto alrededor.',
    `# Guía\n\n${guide}`,
    `# Plantilla (${TEMPLATE[kind]})\n\n${template}`,
  ].join('\n\n');

  return async (messages) => {
    const message = await client.beta.messages
      .stream({
        model: GENERATION_MODEL,
        max_tokens: 64000,
        thinking: { type: 'adaptive' },
        output_config: { effort },
        // Si el modelo rechaza la petición, la API la repite en otro modelo
        betas: ['server-side-fallback-2026-07-01'],
        fallbacks: 'default',
        system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
        messages,
      })
      .finalMessage();
    if (message.stop_reason === 'refusal') throw new Error(`El modelo rechazó la petición${message.stop_details?.explanation ? `: ${message.stop_details.explanation}` : ''}`);
    if (message.stop_reason === 'max_tokens') throw new Error('La respuesta se cortó: el texto es demasiado largo');
    return message;
  };
}

const ENCARGO = {
  place: (city: string) => `Escribe un lugar nuevo para la ciudad «${city}», con 2 versiones de la descripción y 2 de la entrada.`,
  npc: (city: string, place: string) =>
    `Escribe un NPC o evento nuevo para «${place}» de «${city}», con su historia completa: un árbol de capítulos de 3 niveles (7 capítulos y 4 finales). Elige el destino de cada final con sentido.`,
};

const textOf = (m: Anthropic.Beta.BetaMessage) =>
  m.content.map((b) => (b.type === 'text' ? b.text : '')).join('').trim();

/** Saca el objeto JSON de la respuesta (admite un bloque ```json alrededor) */
export function extractJson(text: string): unknown {
  const start = text.indexOf('{');
  const end = text.lastIndexOf('}');
  if (start < 0 || end < start) throw new Error('La respuesta no contiene un objeto JSON');
  return JSON.parse(text.slice(start, end + 1));
}

export type GenerateResult = { raw: Record<string, unknown>; world: WorldFile; issues: Issue[]; attempts: number };

/**
 * Genera el elemento y lo valida como lo haría el importador (forma, guía y nombres contra la base).
 * Si hay errores o avisos, le pasa al modelo la lista para que lo corrija, hasta `attempts` veces.
 * Devuelve el último resultado válido (puede traer avisos) o lanza si nunca llegó a ser importable.
 */
export async function generateElement(
  target: GenerateTarget,
  { ask, idea, author, attempts = 3, onAttempt }: { ask: Ask; idea?: string; author: string; attempts?: number; onAttempt?: (n: number, issues: Issue[]) => void },
): Promise<GenerateResult> {
  const loaded = await loadContext(target);
  if ('issue' in loaded) throw new Error(loaded.issue.message);

  const encargo = target.kind === 'place' ? ENCARGO.place(loaded.city.name) : ENCARGO.npc(loaded.city.name, target.place);
  const messages: Anthropic.Beta.BetaMessageParam[] = [
    {
      role: 'user',
      content: [encargo, idea ? `Idea: ${idea}` : '', `# Contexto del juego\n\n${loaded.context}`].filter(Boolean).join('\n\n'),
    },
  ];

  let best: GenerateResult | undefined;
  for (let n = 1; n <= attempts; n++) {
    const message = await ask(messages);
    // Se devuelve el contenido completo (incluido el razonamiento) para continuar la conversación
    messages.push({ role: 'assistant', content: message.content });

    let issues: Issue[];
    let raw: Record<string, unknown> | undefined;
    let world: WorldFile | undefined;
    try {
      const parsed = extractJson(textOf(message));
      if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) throw new Error('El JSON no es un objeto');
      // El destino lo decide quien ejecuta el script, no el modelo
      raw = { ...(parsed as Record<string, unknown>), city: loaded.city.name, ...(target.kind === 'npc' ? { place: target.place } : {}) };
      const file = parseImportFile(target.kind, raw);
      world = file.world;
      issues = file.issues;
      if (world && !issues.some((i) => i.level === 'error')) {
        issues = [...issues, ...file.relabel((await importWorld(world, { author, dryRun: true })).issues)];
      }
    } catch (err) {
      issues = [{ level: 'error', path: '(respuesta)', message: (err as Error).message }];
    }

    onAttempt?.(n, issues);
    if (raw && world && !issues.some((i) => i.level === 'error')) {
      best = { raw, world, issues, attempts: n };
      if (!issues.length) return best;
    }
    if (n < attempts) {
      messages.push({
        role: 'user',
        content:
          'El validador encontró estos problemas. Corrige solo lo que señalan, sin cambiar el resto, y devuelve el JSON completo:\n' +
          issues.map((i) => `- ${i.level === 'error' ? 'ERROR' : 'aviso'} ${i.path}: ${i.message}`).join('\n'),
      });
    }
  }
  if (best) return best;
  throw new Error(`No se consiguió un ${target.kind === 'place' ? 'lugar' : 'NPC'} válido en ${attempts} intentos`);
}

