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

    await writer.patch(api(`/cities/${city.id}/publish`)).send({ published: true }).expect(200);
    const extra = (await otherWriter.post(api(`/cities/${city.id}/description`)).send({ tale: story('Otra versión') }).expect(201)).body;
    await otherWriter.patch(api(`/cities/${city.id}/description/${extra.id}/publish`)).send({ published: true }).expect(200);

    const seen = (await reader.get(api(`/cities/${city.id}`)).expect(200)).body;
    expect(seen.description.map((t: { id: string }) => t.id)).toEqual([extra.id]);
    expect(seen.travel).toEqual([]);

    // listado de lectura: una sola versión publicada de cada relato (null si no hay ninguna)
    const [reading] = (await reader.get(api('/cities')).expect(200)).body;
    expect(reading).toMatchObject({ id: city.id, name: 'Vel Aran', description: { id: extra.id, published: true }, travel: null });
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
    await writer.patch(api(`/cities/${city.id}/publish`)).send({ published: true }).expect(200);
    const published = [city.description[0].id];
    for (const text of ['Segunda', 'Tercera']) {
      const tale = (await writer.post(api(`/cities/${city.id}/description`)).send({ tale: story(text) }).expect(201)).body;
      if (text === 'Segunda') {
        await writer.patch(api(`/cities/${city.id}/description/${tale.id}/publish`)).send({ published: true }).expect(200);
        published.push(tale.id);
      }
    }
    await writer.patch(api(`/cities/${city.id}/description/${city.description[0].id}/publish`)).send({ published: true }).expect(200);

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
    // con dinero o ítem no hay opciones que elegir; las tiendas y postas pueden tener las que quieran
    await create({ decision: { decisionType: 'money', amount: 5 } }).expect(201);
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
    await writer.patch(api(`/cities/${city.id}/publish`)).send({ published: true }).expect(200);

    expect((await reader.get(api(`/cities/${city.id}/places`)).expect(200)).body).toEqual([]);
    await reader.get(api(`/places/${place.id}`)).expect(404);

    await writer.patch(api(`/places/${place.id}/publish`)).send({ published: true }).expect(200);
    // publicado el lugar pero no su descripción: aparece sin versión
    expect((await reader.get(api(`/cities/${city.id}/places`)).expect(200)).body).toEqual([
      expect.objectContaining({ id: place.id, name: 'Taberna', description: null, entry: null }),
    ]);
    await writer.patch(api(`/places/${place.id}/description/${place.description[0].id}/publish`)).send({ published: true }).expect(200);
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
    const character = (await reader.post(api('/me/characters')).send({ name: 'Elara' }).expect(201)).body;
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
