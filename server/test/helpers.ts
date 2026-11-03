import request from 'supertest';
import type { Role } from '@wos/shared';
import { createApp } from '../src/app.js';
import { User } from '../src/models/user.model.js';

export const app = createApp();
export const api = (path: string) => `/api/v1${path}`;

export const story = (text: string) => [{ text, animation: 'default' as const }];

/** Registra un usuario y devuelve un agente con la cookie de sesión */
export async function signUp(username: string, roles: Role[] = ['Reader']) {
  const agent = request.agent(app);
  const res = await agent
    .post(api('/auth/register'))
    .send({ username, email: `${username}@test.com`, password: 'password123' })
    .expect(201);
  if (roles.join() !== 'Reader') await User.updateOne({ username }, { role: roles });
  return { agent, user: res.body as { id: string; username: string } };
}
