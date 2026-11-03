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
    expect((await reader.get(api('/cities')).expect(200)).body).toEqual([]);

    await writer.patch(api(`/cities/${city.id}/publish`)).send({ published: true }).expect(200);
    const extra = (await otherWriter.post(api(`/cities/${city.id}/description`)).send({ tale: story('Otra versión') }).expect(201)).body;
    await otherWriter.patch(api(`/cities/${city.id}/description/${extra.id}/publish`)).send({ published: true }).expect(200);

    const seen = (await reader.get(api(`/cities/${city.id}`)).expect(200)).body;
    expect(seen.description.map((t: { id: string }) => t.id)).toEqual([extra.id]);
    expect(seen.travel).toEqual([]);

    // los escritores ven todo y pueden filtrar
    expect((await writer.get(api(`/cities/${city.id}`)).expect(200)).body.description).toHaveLength(2);
    expect((await writer.get(api('/cities?published=false')).expect(200)).body).toEqual([]);
    expect((await reader.get(api('/cities?published=false')).expect(200)).body).toHaveLength(1);
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
          decision: { options: [{ name: 'Aceptar', description: 'Escuchar su historia' }] },
        })
        .expect(201)
    ).body;
    return { city, place, npc };
  }

  it('crea lugar y NPC con su capítulo inicial', async () => {
    const { city, place, npc } = await createWorld();
    expect(place).toMatchObject({ cityId: city.id, name: 'Taberna', npcIds: [] });
    expect(npc).toMatchObject({ name: 'Bardo', npcType: 'historias', placeId: place.id, author: 'escritora' });
    expect(npc).not.toHaveProperty('chapters');
    expect(npc.decision.options[0]).toMatchObject({ name: 'Aceptar', published: true });

    expect((await writer.get(api(`/places/${place.id}`)).expect(200)).body.npcIds).toEqual([npc.id]);
    expect((await writer.get(api(`/cities/${city.id}/places`)).expect(200)).body).toHaveLength(1);

    const chapters = (await writer.get(api(`/npcs/${npc.id}/chapters`)).expect(200)).body;
    expect(chapters).toMatchObject([{ name: 'Inicio', published: false }]);
  });

  it('los lectores no ven lugares ni NPCs sin publicar', async () => {
    const { city, place, npc } = await createWorld();
    await writer.patch(api(`/cities/${city.id}/publish`)).send({ published: true }).expect(200);

    expect((await reader.get(api(`/cities/${city.id}/places`)).expect(200)).body).toEqual([]);
    await reader.get(api(`/places/${place.id}`)).expect(404);

    await writer.patch(api(`/places/${place.id}/publish`)).send({ published: true }).expect(200);
    expect((await reader.get(api(`/places/${place.id}/npcs`)).expect(200)).body).toEqual([]);
    await reader.get(api(`/npcs/${npc.id}`)).expect(404);

    await writer.patch(api(`/npcs/${npc.id}/publish`)).send({ published: true }).expect(200);
    const seen = (await reader.get(api(`/npcs/${npc.id}`)).expect(200)).body;
    expect(seen.meeting).toMatchObject({ published: true, tale: story('Te saluda') });
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

    // publicar un capítulo hace visibles las opciones que llevan a él
    await writer.patch(api(`/npcs/${npc.id}/publish`)).send({ published: true }).expect(200);
    await writer.patch(api(`/chapters/${root.id}/publish`)).send({ published: true }).expect(200);
    expect((await reader.get(api(`/chapters/${root.id}`)).expect(200)).body.decision.options).toEqual([]);

    await writer.patch(api(`/chapters/${toForest.value}/publish`)).send({ published: true }).expect(200);
    const seen = (await reader.get(api(`/chapters/${root.id}`)).expect(200)).body;
    expect(seen.decision.options.map((o: { name: string }) => o.name)).toEqual(['Bosque', 'Río']);
    await reader.get(api(`/chapters/${toRiver.value}`)).expect(404);

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
