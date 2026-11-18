import request from 'supertest';
import { beforeEach, describe, expect, it } from 'vitest';
import type TestAgent from 'supertest/lib/agent.js';
import { api, app, signUp } from './helpers.js';

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

describe('catálogo de objetos', () => {
  it('los escritores crean objetos con nombre, precio y autor; la lista va por nombre', async () => {
    await request(app).get(api('/items')).expect(401);
    // el catálogo lo lee cualquiera con sesión (el lector necesita los nombres); crear, solo los escritores
    await reader.get(api('/items')).expect(200);
    await reader.post(api('/items')).send({ name: 'Farol', price: 3 }).expect(403);

    const farol = (await writer.post(api('/items')).send({ name: '  Farol de sal ', price: 20 }).expect(201)).body;
    expect(farol).toMatchObject({ name: 'Farol de sal', description: '', price: 20, stackable: false, author: 'escritora' });
    // único por defecto; elemento común si se indica (y se puede cambiar)
    const pan = (await writer.post(api('/items')).send({ name: 'Pan', price: 1, stackable: true }).expect(201)).body;
    expect(pan.stackable).toBe(true);
    expect((await writer.patch(api(`/items/${pan.id}`)).send({ stackable: false }).expect(200)).body.stackable).toBe(false);
    await writer.post(api('/items')).send({ name: 'Sal', price: 1, stackable: 'sí' }).expect(400);
    await writer.delete(api(`/items/${pan.id}`)).expect(204);
    // descripción opcional, de hasta 300 caracteres
    const mapa = (await writer.post(api('/items')).send({ name: 'Mapa', description: ' Del cabo norte. ', price: 2 }).expect(201)).body;
    expect(mapa.description).toBe('Del cabo norte.');
    await writer.post(api('/items')).send({ name: 'Ancla', description: 'x'.repeat(301), price: 1 }).expect(400);
    expect((await writer.patch(api(`/items/${mapa.id}`)).send({ description: '' }).expect(200)).body.description).toBe('');
    await writer.delete(api(`/items/${mapa.id}`)).expect(204);
    await otherWriter.post(api('/items')).send({ name: 'Brújula', price: 35 }).expect(201);

    // validación: nombre obligatorio, precio entero y no negativo
    await writer.post(api('/items')).send({ name: '', price: 1 }).expect(400);
    await writer.post(api('/items')).send({ name: 'Ancla', price: -1 }).expect(400);
    await writer.post(api('/items')).send({ name: 'Ancla', price: 1.5 }).expect(400);

    // nombres únicos sin distinguir mayúsculas ni acentos
    const dup = await writer.post(api('/items')).send({ name: 'brujula', price: 1 }).expect(409);
    expect(dup.body.error.message).toContain('«Brújula»');

    const list = (await writer.get(api('/items')).expect(200)).body;
    expect(list.map((i: { name: string }) => i.name)).toEqual(['Brújula', 'Farol de sal']);
  });

  it('solo su autor o un admin editan y borran un objeto', async () => {
    const item = (await writer.post(api('/items')).send({ name: 'Llave de bronce', price: 12 }).expect(201)).body;
    await otherWriter.post(api('/items')).send({ name: 'Mapa', price: 5 }).expect(201);

    await otherWriter.patch(api(`/items/${item.id}`)).send({ price: 1 }).expect(403);
    await otherWriter.delete(api(`/items/${item.id}`)).expect(403);

    const edited = (await writer.patch(api(`/items/${item.id}`)).send({ name: 'Llave de hierro', price: 15 }).expect(200)).body;
    expect(edited).toMatchObject({ name: 'Llave de hierro', price: 15, author: 'escritora' });
    // cambiar a un nombre que ya usa otro objeto, no; mantener el suyo (aunque cambie mayúsculas), sí
    await writer.patch(api(`/items/${item.id}`)).send({ name: 'mapa' }).expect(409);
    await writer.patch(api(`/items/${item.id}`)).send({ name: 'LLAVE DE HIERRO' }).expect(200);

    await admin.patch(api(`/items/${item.id}`)).send({ price: 30 }).expect(200);
    await admin.delete(api(`/items/${item.id}`)).expect(204);
    await writer.delete(api(`/items/${item.id}`)).expect(404);
  });

  it('al cambiar el username, sus objetos siguen siendo suyos', async () => {
    const item = (await writer.post(api('/items')).send({ name: 'Ancla', price: 7 }).expect(201)).body;
    await writer.patch(api('/me')).send({ username: 'escritora_nueva' }).expect(200);
    const [saved] = (await writer.get(api('/items')).expect(200)).body;
    expect(saved).toMatchObject({ id: item.id, author: 'escritora_nueva' });
    await writer.patch(api(`/items/${item.id}`)).send({ price: 8 }).expect(200);
  });
});
