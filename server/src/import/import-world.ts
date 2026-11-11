import { randomBytes } from 'node:crypto';
import mongoose from 'mongoose';
import { hashPassword } from '../lib/auth.js';
import { City, type CityDoc } from '../models/city.model.js';
import { Npc } from '../models/npc.model.js';
import { User } from '../models/user.model.js';
import type { Issue, WorldChapter, WorldFile } from './world-file.js';

/** Autor genérico de los relatos generados por un modelo */
export const GENERATED_AUTHOR = 'TellerIA';

/**
 * Comprueba que exista el autor. TellerIA se crea si falta: un escritor sin contraseña conocida
 * (nadie inicia sesión con él), solo para firmar los relatos generados.
 */
export async function ensureAuthor(username: string, { create = true } = {}): Promise<{ created: boolean }> {
  if (await User.exists({ username })) return { created: false };
  if (username !== GENERATED_AUTHOR) throw new Error(`No existe el usuario "${username}"`);
  if (!create) return { created: false };
  await User.create({
    username,
    email: 'telleria@worldofstories.invalid',
    password: await hashPassword(randomBytes(32).toString('hex')),
    role: ['Reader', 'Writer'],
  });
  return { created: true };
}

export type ImportOptions = {
  /** Autor de todo lo importado (un usuario existente) */
  author: string;
  /**
   * Publica todo lo importado: ciudades y lugares nuevos, versiones nuevas, NPCs y capítulos. Las ciudades y
   * lugares que ya existían conservan su estado. Si no, todo queda en borrador para revisarlo.
   */
  publish?: boolean;
  /** Solo comprueba que todo se pueda resolver, sin escribir */
  dryRun?: boolean;
};

export type ImportSummary = {
  cities: { created: string[]; extended: string[] };
  places: { created: string[]; extended: string[] };
  npcs: string[];
  chapters: number;
};

/**
 * Importa un archivo de mundo ya validado (`worldFileSchema` + `lintWorld` sin errores). Es aditivo:
 * - una ciudad o un lugar que ya existe (mismo nombre) recibe las versiones nuevas de sus textos;
 * - los NPCs siempre se crean nuevos, con sus capítulos enlazados (aceptar → capítulo inicial).
 *
 * Los finales de capítulo (`end`) se resuelven por nombre entre lo importado y lo que ya hay en la base.
 * Si algo no se puede resolver, devuelve los errores sin escribir nada.
 */
export async function importWorld(world: WorldFile, opts: ImportOptions): Promise<{ issues: Issue[]; summary?: ImportSummary }> {
  const { author, publish = false } = opts;
  const now = new Date();
  const state = { published: publish, publishDate: publish ? now : null };
  const version = (paragraphs: string[]) => ({
    tale: paragraphs.map((text) => ({ text, animation: 'default' })),
    author,
    writeDate: now,
    ...state,
  });

  // 1. Resolver nombres: ciudades del archivo o de la base, y los finales de los capítulos
  const existing = await City.find({ name: { $in: world.cities.map((c) => c.name) } });
  const findExisting = (name: string) => existing.find((c) => c.name.toLowerCase() === name.toLowerCase());
  const issues: Issue[] = [];
  // Ciudades de destino que no vienen en el archivo: tienen que existir ya
  const endCities = world.cities
    .flatMap((c) => c.places.flatMap((p) => p.npcs.flatMap((n) => n.chapters.map((ch) => ch.end?.city))))
    .filter((name): name is string => !!name && !world.cities.some((x) => same(x.name, name)));
  const outside = endCities.length ? await City.find({ name: { $in: endCities } }) : [];

  // Lo que no existe se crea, y para eso hacen falta sus textos
  world.cities.forEach((c, ci) => {
    const db = findExisting(c.name);
    if (!db && (!c.descriptions.length || !c.travels.length)) {
      issues.push({ level: 'error', path: `cities[${ci}]`, message: `No existe la ciudad «${c.name}»: para crearla hacen falta descriptions y travels` });
    }
    c.places.forEach((p, pi) => {
      if (db?.places.some((x) => same(x.name, p.name))) return;
      if (!p.descriptions.length || !p.entries.length) {
        issues.push({
          level: 'error',
          path: `cities[${ci}].places[${pi}]`,
          message: `No existe el lugar «${p.name}» en «${c.name}»: para crearlo hacen falta descriptions y entries`,
        });
      }
    });
  });
  world.cities.forEach((c, ci) =>
    c.places.forEach((p, pi) =>
      p.npcs.forEach((n, ni) =>
        n.chapters.forEach((ch, chi) => {
          if (ch.options?.length || !ch.end) return;
          const path = `cities[${ci}].places[${pi}].npcs[${ni}].chapters[${chi}].end`;
          const cityName = ch.end.city ?? c.name;
          const inFile = world.cities.find((x) => same(x.name, cityName));
          const inDb = [...existing, ...outside].find((x) => same(x.name, cityName));
          if (!inFile && !inDb) return issues.push({ level: 'error', path, message: `No existe la ciudad «${cityName}»` });
          if (
            ch.end.place &&
            !inFile?.places.some((x) => same(x.name, ch.end!.place!)) &&
            !inDb?.places.some((x) => same(x.name, ch.end!.place!))
          ) {
            issues.push({ level: 'error', path, message: `No existe el lugar «${ch.end.place}» en «${cityName}»` });
          }
        }),
      ),
    ),
  );
  if (issues.length || opts.dryRun) return { issues };

  // 2. Ciudades y lugares (nuevos o con versiones añadidas)
  const summary: ImportSummary = { cities: { created: [], extended: [] }, places: { created: [], extended: [] }, npcs: [], chapters: 0 };
  const saved = new Map<string, CityDoc>();
  for (const c of world.cities) {
    let city = findExisting(c.name);
    if (city) {
      city.description.push(...c.descriptions.map((d) => version([d])));
      city.travel.push(...c.travels.map(version));
      if (c.descriptions.length || c.travels.length) summary.cities.extended.push(city.name);
    } else {
      city = new City({ name: c.name, createdBy: author, ...state, description: c.descriptions.map((d) => version([d])), travel: c.travels.map(version) });
      summary.cities.created.push(city.name);
    }
    for (const p of c.places) {
      const place = city.places.find((x) => same(x.name, p.name));
      if (place) {
        place.description.push(...p.descriptions.map((d) => version([d])));
        place.entry.push(...p.entries.map(version));
        if (p.descriptions.length || p.entries.length) summary.places.extended.push(`${city.name} › ${place.name}`);
      } else {
        city.places.push({
          name: p.name,
          createdBy: author,
          ...state,
          description: p.descriptions.map((d) => version([d])),
          entry: p.entries.map(version),
          events: [],
        });
        summary.places.created.push(`${city.name} › ${p.name}`);
      }
    }
    await city.save();
    saved.set(c.name.toLowerCase(), city);
  }

  const cityByName = async (name: string) =>
    saved.get(name.toLowerCase()) ?? outside.find((x) => same(x.name, name)) ?? (await City.findOne({ name }))!;

  // 3. NPCs con sus capítulos
  for (const c of world.cities) {
    const city = saved.get(c.name.toLowerCase())!;
    for (const p of c.places) {
      const place = city.places.find((x) => same(x.name, p.name))!;
      for (const n of p.npcs) {
        const ids = new Map(n.chapters.map((ch) => [ch.id, new mongoose.Types.ObjectId()]));
        const chapters = [];
        for (const ch of n.chapters) chapters.push(await toChapter(ch, ids, { city, place }, cityByName, author, state));
        const root = ids.get(n.chapters[0]!.id)!.toString();
        const npc = await Npc.create({
          name: n.name,
          title: n.title,
          npcType: 'story',
          placeId: place._id,
          author,
          ...state,
          writeDate: now,
          description: version([n.description]),
          meeting: version(n.meeting),
          rejected: version(n.rejected),
          // Aceptar lleva al capítulo inicial; rechazar, al texto de rechazo
          decision: {
            decisionType: 'choose',
            options: [
              { ...n.accept, value: root, published: true },
              { ...n.reject, value: '', published: true },
            ],
          },
          items: [],
          chapters,
        });
        place.events.push(npc._id);
        summary.npcs.push(`${city.name} › ${place.name} › ${npc.name}`);
        summary.chapters += chapters.length;
      }
    }
    await city.save();
  }
  return { issues: [], summary };
}

const same = (a: string, b: string) => a.trim().toLowerCase() === b.trim().toLowerCase();

async function toChapter(
  ch: WorldChapter,
  ids: Map<string, mongoose.Types.ObjectId>,
  home: { city: CityDoc; place: CityDoc['places'][number] },
  cityByName: (name: string) => Promise<CityDoc>,
  author: string,
  state: { published: boolean; publishDate: Date | null },
) {
  const options = ch.options ?? [];
  let endLocation = null;
  if (!options.length) {
    // Final: donde diga `end`, o de vuelta al lugar del NPC
    const city = ch.end?.city ? await cityByName(ch.end.city) : home.city;
    const placeName = ch.end?.place ?? (ch.end?.city ? undefined : home.place.name);
    const place = placeName ? city.places.find((x) => same(x.name, placeName)) : undefined;
    endLocation = { endChapter: true, cityId: city.id as string, ...(place ? { placeId: place.id as string } : {}) };
  }
  return {
    _id: ids.get(ch.id)!,
    name: ch.name,
    story: ch.text.map((f) => (typeof f === 'string' ? { text: f, animation: 'default' } : f)),
    items: [],
    author,
    writeDate: new Date(),
    ...state,
    endLocation,
    usersDecisions: options.length
      ? {
          decisionType: 'choose',
          options: options.map((o) => ({ name: o.name, description: o.description, value: ids.get(o.to)!.toString(), published: state.published })),
        }
      : null,
  };
}
