import { describe, expect, it } from 'vitest';
import { api, signUp } from './helpers.js';
import { lintWorld, parseImportFile, worldFileSchema, type WorldFile } from '../src/import/world-file.js';
import { ensureAuthor, GENERATED_AUTHOR, importWorld } from '../src/import/import-world.js';
import { User } from '../src/models/user.model.js';

/** Párrafo de relleno con la longitud pedida, en presente y sin diálogos */
const para = (chars: number, end = '.') => ('El viento recorre la calle y las lámparas tiemblan sobre la piedra. '.repeat(40).slice(0, chars - 1).trim() + end);
const paras = (n: number, each: number, question = false) =>
  Array.from({ length: n }, (_, i) => para(each, question && i === n - 1 ? '?' : '.'));

const option = (name: string) => ({ name, description: 'Lo piensas un momento antes de decidir.' });
const chapter = (id: string, to?: [string, string], end?: { city?: string; place?: string }) => ({
  id,
  name: `Capítulo ${id}`,
  text: paras(6, 200, !!to),
  ...(to ? { options: [{ ...option('Seguir'), to: to[0] }, { ...option('Volver'), to: to[1] }] } : {}),
  ...(end ? { end } : {}),
});

/** Un mundo que cumple todas las pautas: árbol de 3 niveles con 4 finales (7 capítulos) */
const world = (): WorldFile =>
  worldFileSchema.parse({
    cities: [
      {
        name: 'Puerto Ceniza',
        descriptions: ['Una ciudad de muros negros levantada sobre un volcán dormido.'],
        travels: [paras(5, 300)],
        places: [
          {
            name: 'El mercado de humo',
            descriptions: ['Puestos de lona gris bajo un cielo siempre nublado.'],
            entries: [paras(4, 300)],
            npcs: [
              {
                name: 'Vendedora de mapas ciegos',
                description: 'Una mujer extiende mapas sin dibujos sobre una manta.',
                meeting: paras(4, 300, true),
                accept: option('Mirar sus mapas'),
                reject: option('Seguir de largo'),
                rejected: paras(3, 300),
                chapters: [
                  chapter('inicio', ['a', 'b']),
                  chapter('a', ['a1', 'a2']),
                  chapter('b', ['b1', 'b2']),
                  chapter('a1'),
                  chapter('a2', undefined, { city: 'Puerto Ceniza' }),
                  chapter('b1', undefined, { place: 'El mercado de humo' }),
                  chapter('b2'),
                ],
              },
            ],
          },
        ],
      },
    ],
  });

describe('archivos de mundo', () => {
  it('un mundo que sigue la guía no tiene avisos', () => {
    expect(lintWorld(world())).toEqual([]);
  });

  it('avisa de lo que se sale de la guía y falla con árboles rotos', () => {
    const w = world();
    const npc = w.cities[0]!.places[0]!.npcs[0]!;
    w.cities[0]!.name = 'La Gran Ciudad Del Volcán';
    npc.meeting = ['«Claro que sí», dices sonriendo.'];
    npc.chapters[3]!.options = [{ ...option('Atrás'), to: 'inicio' }]; // ciclo
    npc.chapters[4]!.options = [{ ...option('Perdido'), to: 'nada' }];
    const issues = lintWorld(w);
    const messages = issues.map((i) => `${i.level} ${i.path}: ${i.message}`);
    expect(messages).toEqual(
      expect.arrayContaining([
        'warning cities[0].name: El nombre tiene 5 palabras (entre 1 y 3)',
        expect.stringMatching(/^warning .*meeting: 1 párrafos/),
        expect.stringMatching(/^warning .*meeting\[0\]: Posible diálogo directo del Peregrino/),
        expect.stringMatching(/^error .*chapters\[4\]\.options\[0\]\.to: No existe el capítulo «nada»/),
        expect.stringMatching(/^error .*chapters: Hay un ciclo/),
      ]),
    );
  });

  it('importa como borrador o publicado, y suma versiones a lo que ya existe', async () => {
    const { agent: reader } = await signUp('lectora');
    await signUp('generador', ['Reader', 'Writer']);

    const published = await importWorld(world(), { author: 'generador', publish: true });
    expect(published.summary).toMatchObject({ cities: { created: ['Puerto Ceniza'] }, chapters: 7 });

    // Segunda importación en borrador: la ciudad y el lugar existen (siguen publicados), reciben versiones nuevas y un NPC más
    const draft = await importWorld(world(), { author: 'generador' });
    expect(draft.summary).toMatchObject({ cities: { extended: ['Puerto Ceniza'] }, places: { extended: ['Puerto Ceniza › El mercado de humo'] } });

    const [city] = (await reader.get(api('/cities')).expect(200)).body;
    const [place] = (await reader.get(api(`/cities/${city.id}/places`)).expect(200)).body;
    const npcs = (await reader.get(api(`/places/${place.id}/npcs`)).expect(200)).body;
    expect(npcs).toHaveLength(1); // el borrador no se ve
    const [npc] = npcs;
    expect(npc.decision.options.map((o: { name: string }) => o.name)).toEqual(['Mirar sus mapas', 'Seguir de largo']);

    // aceptar → inicio → a → a2, que termina en la ciudad; b1 termina en el lugar
    const inicio = (await reader.get(api(`/chapters/${npc.decision.options[0].value}`)).expect(200)).body;
    expect(inicio.name).toBe('Capítulo inicio');
    const a = (await reader.get(api(`/chapters/${inicio.decision.options[0].value}`)).expect(200)).body;
    const a2 = (await reader.get(api(`/chapters/${a.decision.options[1].value}`)).expect(200)).body;
    expect(a2.endLocation).toEqual({ endChapter: true, cityId: city.id });
    const b = (await reader.get(api(`/chapters/${inicio.decision.options[1].value}`)).expect(200)).body;
    const b1 = (await reader.get(api(`/chapters/${b.decision.options[0].value}`)).expect(200)).body;
    expect(b1.endLocation).toEqual({ endChapter: true, cityId: city.id, placeId: place.id });
  });

  it('no escribe nada si un final apunta a una ciudad que no existe', async () => {
    await signUp('generador', ['Reader', 'Writer']);
    const w = world();
    w.cities[0]!.places[0]!.npcs[0]!.chapters[6]!.end = { city: 'Atlántida' };
    const { issues, summary } = await importWorld(w, { author: 'generador' });
    expect(summary).toBeUndefined();
    expect(issues).toEqual([expect.objectContaining({ level: 'error', message: 'No existe la ciudad «Atlántida»' })]);
  });

  it('importa por separado ciudades, lugares y NPCs, firmados por TellerIA', async () => {
    const { agent: reader } = await signUp('lectora');
    const w = world();
    const { places, ...city } = w.cities[0]!;
    const { npcs, ...place } = places[0]!;

    // NPC y lugar apuntan a una ciudad que aún no existe: error en el campo de referencia, sin escribir nada
    const npcFile = parseImportFile('npc', { ...npcs[0], city: city.name, place: place.name });
    expect(npcFile.issues).toEqual([]);
    const missing = await importWorld(npcFile.world!, { author: GENERATED_AUTHOR, publish: true });
    expect(npcFile.relabel(missing.issues)).toEqual([
      expect.objectContaining({ path: 'city', message: `No existe la ciudad «${city.name}»` }),
      expect.objectContaining({ path: 'place', message: `No existe el lugar «${place.name}» en «${city.name}»` }),
    ]);

    expect((await ensureAuthor(GENERATED_AUTHOR)).created).toBe(true);
    expect(await User.findOne({ username: GENERATED_AUTHOR })).toMatchObject({ role: ['Reader', 'Writer'] });
    expect((await ensureAuthor(GENERATED_AUTHOR)).created).toBe(false);
    await expect(ensureAuthor('nadie')).rejects.toThrow('No existe el usuario');

    for (const [kind, raw] of [
      ['city', { ...city, places: [] }],
      ['place', { ...place, city: city.name }],
      ['npc', { ...npcs[0], city: city.name, place: place.name }],
    ] as const) {
      const file = parseImportFile(kind, raw);
      expect(file.issues).toEqual([]);
      const { issues } = await importWorld(file.world!, { author: GENERATED_AUTHOR, publish: true });
      expect(issues).toEqual([]);
    }

    const [c] = (await reader.get(api('/cities')).expect(200)).body;
    expect(c.description.author).toBe(GENERATED_AUTHOR);
    const [p] = (await reader.get(api(`/cities/${c.id}/places`)).expect(200)).body;
    const [n] = (await reader.get(api(`/places/${p.id}/npcs`)).expect(200)).body;
    expect(n).toMatchObject({ name: npcs[0]!.name, author: GENERATED_AUTHOR });

    // un lugar suelto con errores de forma se informa con rutas del propio archivo
    expect(parseImportFile('place', { city: 'X', name: '', entries: [] }).issues).toEqual(
      expect.arrayContaining([expect.objectContaining({ level: 'error', path: 'name' })]),
    );
  });
});
