import request from 'supertest';
import { describe, expect, it } from 'vitest';
import { api, app, signUp, story } from './helpers.js';
import { City } from '../src/models/city.model.js';

describe('auth', () => {
  it('registra, deja la cookie httpOnly y no expone la contraseña', async () => {
    const res = await request(app)
      .post(api('/auth/register'))
      .send({ username: 'ana', email: 'ANA@test.com', password: 'password123' })
      .expect(201);

    expect(res.body).toMatchObject({ username: 'ana', email: 'ana@test.com', roles: ['Reader'] });
    expect(res.body.id).toMatch(/^[a-f\d]{24}$/);
    expect(res.body).not.toHaveProperty('password');
    expect(res.body).not.toHaveProperty('_id');
    expect(res.headers['set-cookie']?.[0]).toMatch(/wos_token=.+HttpOnly/);
  });

  it('rechaza datos inválidos y duplicados', async () => {
    const bad = await request(app).post(api('/auth/register')).send({ username: 'a', email: 'x', password: '1' }).expect(400);
    expect(bad.body.error.code).toBe('BAD_REQUEST');
    expect(Object.keys(bad.body.error.details.fieldErrors)).toEqual(['email', 'username', 'password']);

    await signUp('ana');
    await request(app).post(api('/auth/register')).send({ username: 'ana', email: 'otra@test.com', password: 'password123' }).expect(409);
  });

  it('login con username o email, logout y /me', async () => {
    await signUp('ana');
    const agent = request.agent(app);

    await agent.post(api('/auth/login')).send({ identifier: 'ana', password: 'mala-clave' }).expect(401);
    await agent.get(api('/me')).expect(401);

    await agent.post(api('/auth/login')).send({ identifier: 'ANA@test.com', password: 'password123' }).expect(200);
    expect((await agent.get(api('/me')).expect(200)).body.username).toBe('ana');

    await agent.post(api('/auth/logout')).expect(204);
    await agent.get(api('/me')).expect(401);
  });

  it('ignora cookies falsificadas', async () => {
    await request(app).get(api('/me')).set('Cookie', 'wos_token=falso').expect(401);
  });

  it('se vuelve escritor solo con el código correcto', async () => {
    const { agent } = await signUp('ana');
    await agent.post(api('/me/become-writer')).send({ code: 'otro' }).expect(403);
    const res = await agent.post(api('/me/become-writer')).send({ code: 'codigo-escritor' }).expect(200);
    expect(res.body.roles).toEqual(['Reader', 'Writer']);
  });

  it('pide la contraseña actual para cambiar la contraseña', async () => {
    const { agent } = await signUp('ana');
    await agent.patch(api('/me')).send({ password: 'nueva-clave-1' }).expect(403);
    await agent.patch(api('/me')).send({ password: 'nueva-clave-1', currentPassword: 'password123' }).expect(200);
    await request(app).post(api('/auth/login')).send({ identifier: 'ana', password: 'nueva-clave-1' }).expect(200);
  });

  it('al cambiar el username actualiza la autoría de sus relatos', async () => {
    const { agent } = await signUp('ana', ['Reader', 'Writer']);
    const city = (await agent.post(api('/cities')).send({ name: 'Vel', description: story('d'), travel: story('t') }).expect(201)).body;

    await agent.patch(api('/me')).send({ username: 'ana_nueva' }).expect(200);

    const saved = await City.findById(city.id).lean();
    expect(saved?.createdBy).toBe('ana_nueva');
    expect(saved?.description[0]?.author).toBe('ana_nueva');
    // y sigue pudiendo editar lo suyo
    await agent.patch(api(`/cities/${city.id}/description/${city.description[0].id}`)).send({ tale: story('editado') }).expect(200);
  });
});

describe('personajes', () => {
  it('CRUD de personajes y fragmentos leídos sin duplicados', async () => {
    const { agent } = await signUp('ana');
    const created = (await agent.post(api('/me/characters')).send({ name: 'Elara' }).expect(201)).body;
    expect(created).toMatchObject({ name: 'Elara', money: 1000, items: [], fragmentsRead: [], animations: true });

    const cityId = '64b7f0c2a1b2c3d4e5f60718';
    const updated = await agent
      .patch(api(`/me/characters/${created.id}`))
      .send({ location: { cityId }, money: 50, items: ['espada'] })
      .expect(200);
    expect(updated.body).toMatchObject({ location: { cityId }, money: 50, items: ['espada'] });

    await agent.post(api(`/me/characters/${created.id}/read`)).send({ fragmentId: 'f1' }).expect(200);
    const read = await agent.post(api(`/me/characters/${created.id}/read`)).send({ fragmentId: 'f1' }).expect(200);
    expect(read.body.fragmentsRead).toEqual(['f1']);

    // el nombre es opcional: por ahora se distinguen por su ubicación
    const unnamed = (await agent.post(api('/me/characters')).send({}).expect(201)).body;
    expect(unnamed).toMatchObject({ name: '', location: null, whereabouts: null });
    await agent.delete(api(`/me/characters/${unnamed.id}`)).expect(204);

    expect((await agent.get(api('/me/characters')).expect(200)).body).toHaveLength(1);
    await agent.delete(api(`/me/characters/${created.id}`)).expect(204);
    await agent.delete(api(`/me/characters/${created.id}`)).expect(404);
  });
});

describe('usuarios (admin)', () => {
  it('solo un admin gestiona usuarios y roles', async () => {
    const { agent: reader, user } = await signUp('lector');
    const { agent: admin, user: adminUser } = await signUp('jefa', ['Admin']);

    await reader.get(api('/users')).expect(403);
    expect((await admin.get(api('/users')).expect(200)).body).toHaveLength(2);

    const res = await admin.put(api(`/users/${user.id}/roles`)).send({ roles: ['Reader', 'Writer'] }).expect(200);
    expect(res.body.roles).toEqual(['Reader', 'Writer']);

    await admin.put(api(`/users/${adminUser.id}/roles`)).send({ roles: ['Reader'] }).expect(400);
    await admin.delete(api(`/users/${user.id}`)).expect(204);
  });
});
