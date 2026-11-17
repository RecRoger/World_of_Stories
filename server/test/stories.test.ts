import request from 'supertest';
import { Types } from 'mongoose';
import { beforeEach, describe, expect, it } from 'vitest';
import type TestAgent from 'supertest/lib/agent.js';
import { api, app, signUp, story } from './helpers.js';
import { Npc } from '../src/models/npc.model.js';

let writer: TestAgent;
let otherWriter: TestAgent;
let reader: TestAgent;
let admin: TestAgent;

beforeEach(async () => {
  writer = (await signUp('escritora', ['Reader', 'Writer'])).agent;
  otherWriter = (await signUp('otro', ['Reader', 'Writer'])).agent;
  reader = (await signUp('lector')).agent;
  admin = (await signUp('admin', ['Admin'])).agent;
});

/** Decisión válida de un NPC de tipo story: aceptar y rechazar */
const STORY_DECISION = [
  { name: 'Aceptar', description: 'Escuchar su historia' },
  { name: 'Rechazar', description: 'Seguir tu camino' },
];

/** Publica una ciudad con su primera descripción y su primer viaje (sin ellas no se puede publicar) */
const publishCity = async (city: { id: string; description: { id: string }[]; travel: { id: string }[] }) => {
  await writer.patch(api(`/cities/${city.id}/description/${city.description[0]!.id}/publish`)).send({ published: true }).expect(200);
  await writer.patch(api(`/cities/${city.id}/travel/${city.travel[0]!.id}/publish`)).send({ published: true }).expect(200);
  await writer.patch(api(`/cities/${city.id}/publish`)).send({ published: true }).expect(200);
};

/** Igual con un lugar: su primera descripción y su primera entrada */
const publishPlace = async (place: { id: string; description: { id: string }[]; entry: { id: string }[] }) => {
  await writer.patch(api(`/places/${place.id}/description/${place.description[0]!.id}/publish`)).send({ published: true }).expect(200);
  await writer.patch(api(`/places/${place.id}/entry/${place.entry[0]!.id}/publish`)).send({ published: true }).expect(200);
  await writer.patch(api(`/places/${place.id}/publish`)).send({ published: true }).expect(200);
};

const createCity = async (name = 'Vel Aran') =>
  (await writer.post(api('/cities')).send({ name, description: story('Una ciudad de niebla'), travel: story('El camino') }).expect(201))
    .body;

describe('ciudades', () => {
  it('solo los escritores crean ciudades', async () => {
    const body = { name: 'X', description: story('d'), travel: story('t') };
    await request(app).post(api('/cities')).send(body).expect(401);
    await reader.post(api('/cities')).send(body).expect(403);

    const city = await createCity();
    expect(city).toMatchObject({ name: 'Vel Aran', published: false, createdBy: 'escritora' });
    expect(city.description[0]).toMatchObject({ author: 'escritora', published: false, tale: story('Una ciudad de niebla') });
    expect(city).not.toHaveProperty('places');

    await writer.post(api('/cities')).send({ ...body, name: 'Vel Aran' }).expect(409);
  });

  it('los lectores solo ven ciudades y versiones publicadas', async () => {
    const city = await createCity();
    await reader.get(api(`/cities/${city.id}`)).expect(404);
    // el modo lector es igual para todos: sin publicar no aparece ni para su autora
    expect((await reader.get(api('/cities')).expect(200)).body).toEqual([]);
    expect((await writer.get(api('/cities')).expect(200)).body).toEqual([]);

    const extra = (await otherWriter.post(api(`/cities/${city.id}/description`)).send({ tale: story('Otra versión') }).expect(201)).body;
    await otherWriter.patch(api(`/cities/${city.id}/description/${extra.id}/publish`)).send({ published: true }).expect(200);
    await writer.patch(api(`/cities/${city.id}/travel/${city.travel[0].id}/publish`)).send({ published: true }).expect(200);
    await writer.patch(api(`/cities/${city.id}/publish`)).send({ published: true }).expect(200);

    // la primera descripción sigue en borrador: los lectores solo ven la publicada
    const seen = (await reader.get(api(`/cities/${city.id}`)).expect(200)).body;
    expect(seen.description.map((t: { id: string }) => t.id)).toEqual([extra.id]);
    expect(seen.travel.map((t: { id: string }) => t.id)).toEqual([city.travel[0].id]);

    // listado de lectura: una sola versión publicada de cada relato
    const [reading] = (await reader.get(api('/cities')).expect(200)).body;
    expect(reading).toMatchObject({ id: city.id, name: 'Vel Aran', description: { id: extra.id, published: true }, travel: { id: city.travel[0].id } });
    expect(reading).not.toHaveProperty('published');

    // los escritores ven todo en su detalle
    expect((await writer.get(api(`/cities/${city.id}`)).expect(200)).body.description).toHaveLength(2);
  });

  it('el modo escritor lista las ciudades con todas sus versiones', async () => {
    const city = await createCity();
    await request(app).get(api('/writer/cities')).expect(401);
    await reader.get(api('/writer/cities')).expect(403);

    const extra = (await otherWriter.post(api(`/cities/${city.id}/travel`)).send({ tale: story('Otro camino') }).expect(201)).body;
    const [full] = (await otherWriter.get(api('/writer/cities')).expect(200)).body;
    expect(full).toMatchObject({ id: city.id, createdBy: 'escritora', published: false });
    expect(full.description).toHaveLength(1);
    expect(full.travel.map((t: { id: string; published: boolean }) => [t.id, t.published])).toEqual([
      [city.travel[0].id, false],
      [extra.id, false],
    ]);
    expect(full).not.toHaveProperty('places');

    expect((await writer.get(api('/writer/cities?published=true')).expect(200)).body).toEqual([]);
    expect((await writer.get(api('/writer/cities?published=false')).expect(200)).body).toHaveLength(1);
  });

  it('el modo lector elige al azar entre las versiones publicadas', async () => {
    const city = await createCity();
    await publishCity(city);
    const published = [city.description[0].id];
    for (const text of ['Segunda', 'Tercera']) {
      const tale = (await writer.post(api(`/cities/${city.id}/description`)).send({ tale: story(text) }).expect(201)).body;
      if (text === 'Segunda') {
        await writer.patch(api(`/cities/${city.id}/description/${tale.id}/publish`)).send({ published: true }).expect(200);
        published.push(tale.id);
      }
    }

    const seen = new Set<string>();
    for (let i = 0; i < 30; i++) seen.add((await reader.get(api('/cities')).expect(200)).body[0].description.id);
    // nunca la tercera (sin publicar), y con 30 lecturas salen las dos publicadas
    expect([...seen].sort()).toEqual([...published].sort());
  });

  it('cada autor edita sus versiones; un admin puede con todas', async () => {
    const city = await createCity();
    const taleId = city.description[0].id;
    const path = api(`/cities/${city.id}/description/${taleId}`);

    await otherWriter.patch(path).send({ tale: story('robado') }).expect(403);
    await otherWriter.delete(path).expect(403);
    await otherWriter.patch(api(`/cities/${city.id}`)).send({ name: 'Otro nombre' }).expect(403);

    await admin.patch(path).send({ tale: story('corregido') }).expect(200);
    const edited = (await writer.patch(path).send({ tale: story('mío') }).expect(200)).body;
    expect(edited.tale).toEqual(story('mío'));

    await writer.delete(path).expect(204);
    await writer.delete(path).expect(404);
  });

  it('valida IDs y bodies', async () => {
    await writer.get(api('/cities/no-es-un-id')).expect(400);
    const city = await createCity();
    const res = await writer.post(api(`/cities/${city.id}/travel`)).send({ tale: [] }).expect(400);
    expect(res.body.error.message).toBe('Datos inválidos en el body');
    await writer.post(api(`/cities/${city.id}/travel`)).send({ tale: [{ text: 'x', animation: 'baile' }] }).expect(400);
  });
});

describe('lugares, NPCs y capítulos', () => {
  async function createWorld() {
    const city = await createCity();
    const place = (
      await writer.post(api(`/cities/${city.id}/places`)).send({ name: 'Taberna', description: story('Huele a cerveza'), entry: story('Entras') }).expect(201)
    ).body;
    const npc = (
      await writer
        .post(api(`/places/${place.id}/npcs`))
        .send({
          name: 'Bardo',
          title: 'La canción perdida',
          description: story('Un bardo'),
          meeting: story('Te saluda'),
          rejected: story('Se va'),
          decision: { options: STORY_DECISION },
        })
        .expect(201)
    ).body;
    return { city, place, npc };
  }

  it('un NPC de tipo story tiene exactamente dos opciones: aceptar y rechazar', async () => {
    const { place, npc } = await createWorld();
    const base = { name: 'Otro', description: story('d'), meeting: story('m'), rejected: story('r') };
    const create = (body: object) => writer.post(api(`/places/${place.id}/npcs`)).send({ ...base, ...body });

    await create({ decision: { options: [STORY_DECISION[0]] } }).expect(400);
    await create({ decision: { options: [...STORY_DECISION, { name: 'Tres', description: 'Una más' }] } }).expect(400);
    await create({}).expect(400); // sin decisión
    // con dinero también son dos: pagar para aceptar y rechazar; y el monto es obligatorio
    await create({ decision: { decisionType: 'money', amount: 5 } }).expect(400);
    await create({ decision: { decisionType: 'money', options: STORY_DECISION } }).expect(400);
    const paid = (await create({ decision: { decisionType: 'money', amount: 5, options: STORY_DECISION } }).expect(201)).body;
    expect(paid.decision.options[0].value).not.toBe('');
    // las tiendas y postas pueden tener las opciones que quieran

    await create({ npcType: 'store', decision: { options: [STORY_DECISION[0]] } }).expect(201);

    // al editar se valida el resultado: quitar una opción, o pasar a story con tres, no se puede
    await writer.patch(api(`/npcs/${npc.id}`)).send({ decision: { options: [STORY_DECISION[0]] } }).expect(400);
    const store = (await create({ npcType: 'store', decision: { options: [...STORY_DECISION, { name: 'Tres', description: 'x' }] } }).expect(201))
      .body;
    await writer.patch(api(`/npcs/${store.id}`)).send({ npcType: 'story' }).expect(400);
  });

  it('el modo escritor lista los NPCs de un lugar completos', async () => {
    const { place, npc } = await createWorld();
    await reader.get(api(`/writer/places/${place.id}/npcs`)).expect(403);
    const [full] = (await otherWriter.get(api(`/writer/places/${place.id}/npcs`)).expect(200)).body;
    expect(full).toMatchObject({ id: npc.id, npcType: 'story', published: false, meeting: { tale: story('Te saluda') } });
    expect(full.decision.options.map((o: { name: string }) => o.name)).toEqual(['Aceptar', 'Rechazar']);
    expect(full).not.toHaveProperty('chapters');
  });

  it('una ciudad o un lugar solo se publica con una descripción y un viaje/entrada publicados', async () => {
    const { city, place } = await createWorld();
    const publish = (path: string, published = true) => writer.patch(api(`${path}/publish`)).send({ published });

    // sin versiones publicadas no se puede; con solo la descripción, tampoco
    expect((await publish(`/cities/${city.id}`).expect(409)).body.error.message).toContain('una descripción y un viaje');
    await publish(`/cities/${city.id}/description/${city.description[0].id}`).expect(200);
    await publish(`/cities/${city.id}`).expect(409);
    await publish(`/cities/${city.id}/travel/${city.travel[0].id}`).expect(200);
    await publish(`/cities/${city.id}`).expect(200);
    // despublicar la ciudad siempre se puede
    expect((await publish(`/cities/${city.id}`, false).expect(200)).body.published).toBe(false);
    await publish(`/cities/${city.id}`).expect(200);

    // despublicar el único viaje publicado despublica la ciudad
    const extra = (await writer.post(api(`/cities/${city.id}/travel`)).send({ tale: story('Otro camino') }).expect(201)).body;
    await publish(`/cities/${city.id}/travel/${extra.id}`).expect(200);
    await publish(`/cities/${city.id}/travel/${city.travel[0].id}`, false).expect(200);
    expect((await writer.get(api(`/cities/${city.id}`))).body.published).toBe(true); // queda el otro viaje
    await publish(`/cities/${city.id}/travel/${extra.id}`, false).expect(200);
    expect((await writer.get(api(`/cities/${city.id}`))).body).toMatchObject({ published: false, publishDate: null });

    // lugares: lo mismo con la entrada, y borrar la última versión publicada también lo despublica
    expect((await publish(`/places/${place.id}`).expect(409)).body.error.message).toContain('una descripción y una entrada');
    await publish(`/places/${place.id}/description/${place.description[0].id}`).expect(200);
    await publish(`/places/${place.id}/entry/${place.entry[0].id}`).expect(200);
    await publish(`/places/${place.id}`).expect(200);
    await writer.delete(api(`/places/${place.id}/description/${place.description[0].id}`)).expect(204);
    expect((await writer.get(api(`/places/${place.id}`))).body.published).toBe(false);
  });

  it('crea lugar y NPC con su capítulo inicial', async () => {
    const { city, place, npc } = await createWorld();
    expect(place).toMatchObject({ cityId: city.id, name: 'Taberna', npcIds: [] });
    expect(npc).toMatchObject({ name: 'Bardo', npcType: 'story', placeId: place.id, author: 'escritora' });
    expect(npc).not.toHaveProperty('chapters');
    expect(npc.decision.options[0]).toMatchObject({ name: 'Aceptar', published: true });

    expect((await writer.get(api(`/places/${place.id}`)).expect(200)).body.npcIds).toEqual([npc.id]);
    // modo escritor: el lugar completo, con todas sus versiones
    const [full] = (await writer.get(api(`/writer/cities/${city.id}/places`)).expect(200)).body;
    expect(full).toMatchObject({ id: place.id, name: 'Taberna', createdBy: 'escritora', npcIds: [npc.id] });
    expect(full.description[0]).toMatchObject({ tale: story('Huele a cerveza'), published: false });
    await reader.get(api(`/writer/cities/${city.id}/places`)).expect(403);

    const chapters = (await writer.get(api(`/npcs/${npc.id}/chapters`)).expect(200)).body;
    expect(chapters).toMatchObject([{ name: 'Inicio', published: false }]);
    // aceptar lleva al capítulo inicial; rechazar, a ninguno
    expect(npc.decision.options.map((o: { value: string }) => o.value)).toEqual([chapters[0].id, '']);
  });

  it('el modo escritor lista los capítulos completos de un NPC', async () => {
    const { npc } = await createWorld();
    await reader.get(api(`/writer/npcs/${npc.id}/chapters`)).expect(403);
    const [root] = (await writer.get(api(`/writer/npcs/${npc.id}/chapters`)).expect(200)).body;
    await writer
      .patch(api(`/chapters/${root.id}`))
      .send({ story: [{ text: 'Hace mucho', animation: 'chatA' }], decision: { options: [{ name: 'Seguir', description: 'Seguir' }] } })
      .expect(200);
    const full = (await otherWriter.get(api(`/writer/npcs/${npc.id}/chapters`)).expect(200)).body;
    expect(full).toMatchObject([
      { id: root.id, npcId: npc.id, story: [{ text: 'Hace mucho', animation: 'chatA' }], decision: { options: [{ name: 'Seguir' }] } },
      { name: 'Seguir', story: [], decision: null },
    ]);
  });

  it('los lectores no ven lugares ni NPCs sin publicar', async () => {
    const { city, place, npc } = await createWorld();
    // ciudad sin publicar: su listado de lectura no existe, tampoco para escritores
    await writer.get(api(`/cities/${city.id}/places`)).expect(404);
    await publishCity(city);

    expect((await reader.get(api(`/cities/${city.id}/places`)).expect(200)).body).toEqual([]);
    await reader.get(api(`/places/${place.id}`)).expect(404);

    await publishPlace(place);
    expect((await reader.get(api(`/cities/${city.id}/places`)).expect(200)).body[0].description).toMatchObject({
      tale: story('Huele a cerveza'),
    });
    expect((await reader.get(api(`/places/${place.id}/npcs`)).expect(200)).body).toEqual([]);
    await reader.get(api(`/npcs/${npc.id}`)).expect(404);

    // un NPC de tipo story necesita sus capítulos publicados
    await writer.patch(api(`/npcs/${npc.id}/publish`)).send({ published: true }).expect(409);
    const [root] = (await writer.get(api(`/npcs/${npc.id}/chapters`))).body;
    await writer.patch(api(`/chapters/${root.id}/publish`)).send({ published: true }).expect(200);
    await writer.patch(api(`/npcs/${npc.id}/publish`)).send({ published: true }).expect(200);
    const seen = (await reader.get(api(`/npcs/${npc.id}`)).expect(200)).body;
    expect(seen.meeting).toMatchObject({ published: true, tale: story('Te saluda') });

    // modo lector: el NPC con sus textos y su decisión (igual para escritores)
    const [reading] = (await writer.get(api(`/places/${place.id}/npcs`)).expect(200)).body;
    expect(reading).toMatchObject({ id: npc.id, name: 'Bardo', description: { tale: story('Un bardo') }, rejected: { tale: story('Se va') } });
    expect(reading.decision.options.map((o: { value: string }) => o.value)).toEqual([root.id, '']);
  });

  it('el modo lector muestra lo publicado también a los escritores', async () => {
    const { npc } = await createWorld();
    const [root] = (await writer.get(api(`/writer/npcs/${npc.id}/chapters`))).body;
    await writer.get(api(`/chapters/${root.id}`)).expect(404);
  });

  it('los personajes saben dónde están', async () => {
    const { city, place, npc } = await createWorld();
    const [root] = (await writer.get(api(`/writer/npcs/${npc.id}/chapters`))).body;
    const character = (await reader.post(api('/me/characters')).expect(201)).body;
    expect(character.whereabouts).toBeNull();

    const at = async (location: object) =>
      (await reader.patch(api(`/me/characters/${character.id}`)).send({ location }).expect(200)).body.whereabouts;
    expect(await at({ cityId: city.id })).toEqual({ kind: 'city', city: 'Vel Aran', place: null, npc: null, chapter: null });
    expect(await at({ cityId: city.id, placeId: place.id })).toMatchObject({ kind: 'place', place: 'Taberna' });
    expect(await at({ cityId: city.id, placeId: place.id, npcId: npc.id })).toMatchObject({ kind: 'npc', npc: 'Bardo' });
    expect(await at({ cityId: city.id, placeId: place.id, npcId: npc.id, chapterId: root.id })).toEqual({
      kind: 'chapter',
      city: 'Vel Aran',
      place: 'Taberna',
      npc: 'Bardo',
      chapter: 'Inicio',
    });
    expect((await reader.get(api('/me/characters')).expect(200)).body[0].whereabouts.kind).toBe('chapter');
    expect(await at(null as unknown as object)).toBeNull();
  });

  it('las decisiones ramifican la historia en capítulos', async () => {
    const { npc } = await createWorld();
    const [root] = (await writer.get(api(`/npcs/${npc.id}/chapters`))).body;

    // opciones sin destino crean capítulos hijos
    const edited = (
      await writer
        .patch(api(`/chapters/${root.id}`))
        .send({
          story: story('Hace mucho tiempo...'),
          decision: {
            options: [
              { name: 'Bosque', description: 'Ir al bosque' },
              { name: 'Río', description: 'Ir al río' },
            ],
          },
        })
        .expect(200)
    ).body;
    expect(edited.author).toBe('escritora');
    const [toForest, toRiver] = edited.decision.options;
    expect(toForest).toMatchObject({ name: 'Bosque', published: false });

    let chapters = (await writer.get(api(`/npcs/${npc.id}/chapters`))).body;
    expect(chapters.map((c: { name: string }) => c.name)).toEqual(['Inicio', 'Bosque', 'Río']);

    // editar las opciones conserva sus IDs y permite apuntar a un capítulo existente
    const relinked = (
      await writer
        .patch(api(`/chapters/${root.id}`))
        .send({ decision: { options: [{ ...toForest, description: 'Cruzar el bosque' }, { ...toRiver, value: toForest.value }] } })
        .expect(200)
    ).body;
    expect(relinked.decision.options.map((o: { id: string }) => o.id)).toEqual([toForest.id, toRiver.id]);
    expect(relinked.decision.options[1].value).toBe(toForest.value);
    expect((await writer.get(api(`/npcs/${npc.id}/chapters`))).body).toHaveLength(3);

    await writer
      .patch(api(`/chapters/${root.id}`))
      .send({ decision: { options: [{ name: 'X', description: 'x', value: '64b7f0c2a1b2c3d4e5f60718' }] } })
      .expect(400);

    // publicar un capítulo publica en cadena los capítulos a los que llevan sus decisiones
    await writer.patch(api(`/chapters/${root.id}/publish`)).send({ published: true }).expect(200);
    chapters = (await writer.get(api(`/npcs/${npc.id}/chapters`))).body;
    expect(chapters.map((c: { published: boolean }) => c.published)).toEqual([true, true, false]);

    // Río quedó sin decisión que lleve a él: el NPC no se publica hasta publicarlo también
    const conflict = await writer.patch(api(`/npcs/${npc.id}/publish`)).send({ published: true }).expect(409);
    expect(conflict.body.error.message).toContain('«Río»');
    await writer.patch(api(`/chapters/${toRiver.value}/publish`)).send({ published: true }).expect(200);
    await writer.patch(api(`/npcs/${npc.id}/publish`)).send({ published: true }).expect(200);
    expect((await reader.get(api(`/chapters/${root.id}`)).expect(200)).body.decision.options).toHaveLength(2);

    // despublicar un capítulo oculta a los lectores las opciones que llevan a él
    await writer.patch(api(`/chapters/${toForest.value}/publish`)).send({ published: false }).expect(200);
    expect((await reader.get(api(`/chapters/${root.id}`)).expect(200)).body.decision.options).toEqual([]);
    await reader.get(api(`/chapters/${toForest.value}`)).expect(404);

    // borrar un capítulo quita las opciones que apuntaban a él; el inicial no se borra
    await writer.delete(api(`/chapters/${root.id}`)).expect(409);
    await writer.delete(api(`/chapters/${toForest.value}`)).expect(204);
    const after = (await writer.get(api(`/chapters/${root.id}`))).body;
    expect(after.decision.options).toEqual([]);
    chapters = (await writer.get(api(`/npcs/${npc.id}/chapters`))).body;
    expect(chapters.map((c: { name: string }) => c.name)).toEqual(['Inicio', 'Río']);
  });

  it('las decisiones de dinero cobran al personaje la primera opción', async () => {
    const { city, place, npc } = await createWorld();
    const [root] = (await writer.get(api(`/npcs/${npc.id}/chapters`))).body;
    // encuentro: pagar 300 para empezar la historia
    await writer
      .patch(api(`/npcs/${npc.id}`))
      .send({ decision: { decisionType: 'money', amount: 300, options: STORY_DECISION } })
      .expect(200);
    // capítulo: la primera opción cuesta 800; la segunda es gratis. Siempre dos opciones y con monto
    const send = (decision: object) => writer.patch(api(`/chapters/${root.id}`)).send({ story: story('Un peaje'), decision });
    const two = [
      { name: 'Pagar', description: 'Pagar el peaje' },
      { name: 'Rodear', description: 'Dar la vuelta' },
    ];
    await send({ decisionType: 'money', amount: 800, options: [two[0]] }).expect(400);
    await send({ decisionType: 'money', amount: 0, options: two }).expect(400);
    const [pay, free] = (await send({ decisionType: 'money', amount: 800, options: two }).expect(200)).body.decision.options;
    await writer.patch(api(`/chapters/${root.id}/publish`)).send({ published: true }).expect(200);
    await writer.patch(api(`/npcs/${npc.id}/publish`)).send({ published: true }).expect(200);
    await publishCity(city);
    await publishPlace(place);
    const reading = (await reader.get(api(`/places/${place.id}/npcs`)).expect(200)).body[0];
    expect(reading.decision).toMatchObject({ decisionType: 'money', amount: 300 });

    const character = (await reader.post(api('/me/characters')).expect(201)).body;
    const charApi = api(`/me/characters/${character.id}`);
    const atNpc = { cityId: city.id, placeId: place.id, npcId: npc.id };
    const accept = reading.decision.options[0].id;

    // hay que estar en la decisión
    await reader.post(api(`/me/characters/${character.id}/pay`)).send({ npcId: npc.id, optionId: accept }).expect(409);
    await reader.patch(charApi).send({ location: atNpc }).expect(200);
    // la opción gratis no se paga
    await reader.post(api(`/me/characters/${character.id}/pay`)).send({ npcId: npc.id, optionId: reading.decision.options[1].id }).expect(400);
    const started = (await reader.post(api(`/me/characters/${character.id}/pay`)).send({ npcId: npc.id, optionId: accept }).expect(200)).body;
    expect(started).toMatchObject({ money: 700, location: { ...atNpc, chapterId: root.id } });

    // en el capítulo: 800 es más de lo que tiene
    const payInChapter = () =>
      reader.post(api(`/me/characters/${character.id}/pay`)).send({ npcId: npc.id, chapterId: root.id, optionId: pay.id });
    expect((await payInChapter().expect(409)).body.error.message).toContain('No tienes suficientes monedas');
    expect((await reader.get(api('/me/characters')).expect(200)).body[0].money).toBe(700);
    // el otro camino sigue libre
    await reader.patch(charApi).send({ location: { ...atNpc, chapterId: free.value } }).expect(200);
    await payInChapter().expect(409); // ya no está en esa decisión
  });

  it('las recompensas dan dinero u objetos al terminar el capítulo', async () => {
    const { city, place, npc } = await createWorld();
    const [root] = (await writer.get(api(`/npcs/${npc.id}/chapters`))).body;
    const edit = (body: object) => writer.patch(api(`/chapters/${root.id}`)).send({ story: story('Un cofre'), ...body });
    // validación: monto mayor que 0, al menos un objeto
    await edit({ reward: { type: 'money', amount: 0 } }).expect(400);
    await edit({ reward: { type: 'item', items: [] } }).expect(400);
    await edit({ reward: { type: 'gema' } }).expect(400);
    expect((await edit({ reward: { type: 'money', amount: 150 } }).expect(200)).body.reward).toEqual({ type: 'money', amount: 150 });

    await writer.patch(api(`/chapters/${root.id}/publish`)).send({ published: true }).expect(200);
    await writer.patch(api(`/npcs/${npc.id}/publish`)).send({ published: true }).expect(200);
    expect((await reader.get(api(`/chapters/${root.id}`)).expect(200)).body.reward).toMatchObject({ type: 'money', amount: 150 });

    const character = (await reader.post(api('/me/characters')).expect(201)).body;
    const claim = () => reader.post(api(`/me/characters/${character.id}/reward`)).send({ chapterId: root.id });
    await claim().expect(409); // no está en el capítulo
    await reader
      .patch(api(`/me/characters/${character.id}`))
      .send({ location: { cityId: city.id, placeId: place.id, npcId: npc.id, chapterId: root.id } })
      .expect(200);

    // dinero: la primera vez sí; al releer, solo si tiene menos de lo que da
    const first = (await claim().expect(200)).body;
    expect(first).toMatchObject({ gained: { money: 150, items: [] }, character: { money: 1150 } });
    expect(first.character).not.toHaveProperty('rewardsClaimed');
    expect((await claim().expect(200)).body).toMatchObject({ gained: { money: 0 }, character: { money: 1150 } });
    await Npc.updateOne({ 'chapters._id': root.id }, { $set: { 'chapters.$.reward.amount': 5000 } });
    expect((await claim().expect(200)).body).toMatchObject({ gained: { money: 5000 }, character: { money: 6150 } });

    // objetos: solo los que no tiene, y sin repetir
    await edit({ reward: { type: 'item', items: ['Llave de bronce', 'Mapa', 'Mapa'] } }).expect(200);
    expect((await claim().expect(200)).body).toMatchObject({ gained: { items: ['Llave de bronce', 'Mapa'] } });
    await edit({ reward: { type: 'item', items: ['Mapa', 'Brújula'] } }).expect(200);
    const again = (await claim().expect(200)).body;
    expect(again.gained).toEqual({ money: 0, items: ['Brújula'] });
    expect(again.character.items).toEqual(['Llave de bronce', 'Mapa', 'Brújula']);

    // al terminar de leer, el cliente marca el capítulo como leído y cobra a la vez: ninguno de los dos falla
    await edit({ reward: { type: 'item', items: ['Farol'] } }).expect(200);
    const [read, reward] = await Promise.all([
      reader.post(api(`/me/characters/${character.id}/read`)).send({ fragmentId: root.id }),
      claim(),
    ]);
    expect([read.status, reward.status]).toEqual([200, 200]);
    const [saved] = (await reader.get(api('/me/characters')).expect(200)).body;
    expect(saved.items).toContain('Farol');
    expect(saved.fragmentsRead).toContain(root.id);

    // quitarla
    expect((await edit({ reward: null }).expect(200)).body.reward).toBeNull();
  });

  it('otro escritor puede escribir un capítulo vacío, pero no editar el ajeno', async () => {
    const { npc } = await createWorld();
    const [root] = (await writer.get(api(`/npcs/${npc.id}/chapters`))).body;
    const edited = (
      await writer
        .patch(api(`/chapters/${root.id}`))
        .send({ story: story('Inicio'), decision: { options: [{ name: 'Seguir', description: 'Seguir' }] } })
    ).body;
    const childId = edited.decision.options[0].value;

    await otherWriter.patch(api(`/chapters/${root.id}`)).send({ name: 'Mío' }).expect(403);
    const child = (await otherWriter.patch(api(`/chapters/${childId}`)).send({ story: story('Continúo yo') }).expect(200)).body;
    expect(child.author).toBe('otro');

    // la cadena de publicación pasa por el capítulo ajeno: hay que poder publicarlos todos
    const denied = await writer.patch(api(`/chapters/${root.id}/publish`)).send({ published: true }).expect(403);
    expect(denied.body.error.message).toContain('Seguir');
    const published = async () =>
      (await writer.get(api(`/writer/npcs/${npc.id}/chapters`))).body.map((c: { published: boolean }) => c.published);
    expect(await published()).toEqual([false, false]);
    await admin.patch(api(`/chapters/${root.id}/publish`)).send({ published: true }).expect(200);
    expect(await published()).toEqual([true, true]);
  });

  it('borrar una ciudad borra sus lugares y NPCs', async () => {
    const { city, npc } = await createWorld();
    await otherWriter.delete(api(`/cities/${city.id}`)).expect(403);
    await writer.delete(api(`/cities/${city.id}`)).expect(204);
    expect(await Npc.findById(npc.id)).toBeNull();
    await writer.get(api(`/cities/${city.id}`)).expect(404);
  });

  it('borrar un NPC lo desvincula de su lugar', async () => {
    const { place, npc } = await createWorld();
    await writer.delete(api(`/npcs/${npc.id}`)).expect(204);
    expect((await writer.get(api(`/places/${place.id}`))).body.npcIds).toEqual([]);
  });
});

describe('datos antiguos', () => {
  it('lee capítulos con historia como textos sueltos y campos a null', async () => {
    const { insertedId } = await Npc.collection.insertOne({
      name: 'Viejo',
      author: '',
      published: true,
      chapters: [
        {
          _id: new Types.ObjectId(),
          name: 'Legado',
          story: ['Érase una vez'],
          usersDecisions: { decisionType: null, amount: null, item: null, options: [] },
          endLocation: { endChapter: null, cityId: null, placeId: null },
          published: true,
        },
      ],
    });
    const [chapter] = (await reader.get(api(`/npcs/${insertedId}/chapters`)).expect(200)).body;
    const res = (await reader.get(api(`/chapters/${chapter.id}`)).expect(200)).body;
    expect(res.story).toEqual([{ text: 'Érase una vez' }]);
    expect(res.decision).toMatchObject({ decisionType: null, options: [] });

    // sin autor, cualquier escritor puede retomarlo
    const edited = (await writer.patch(api(`/chapters/${chapter.id}`)).send({ story: story('Nueva versión') }).expect(200)).body;
    expect(edited.author).toBe('escritora');
  });
});

describe('infraestructura', () => {
  it('responde 404 con formato de error en rutas desconocidas', async () => {
    const res = await request(app).get(api('/nada')).expect(404);
    expect(res.body.error).toMatchObject({ code: 'NOT_FOUND' });
  });

  it('sirve el documento OpenAPI', async () => {
    const res = await request(app).get('/openapi.json').expect(200);
    expect(res.body.paths['/chapters/{chapterId}'].patch.security).toEqual([{ cookieAuth: [] }]);
  });
});
