import { z } from 'zod';
import { objectId, setRolesInputSchema, userSchema, type User as UserDto } from '@wos/shared';
import { ApiRouter } from '../lib/route.js';
import { HttpError, found } from '../lib/http-error.js';
import { User } from '../models/user.model.js';

export const usersApi = new ApiRouter('/users', 'Usuarios (admin)');

const idParams = z.object({ id: objectId });

usersApi
  .route(
    { method: 'get', path: '/', summary: 'Listar usuarios', access: 'admin', response: z.array(userSchema) },
    async () => (await User.find().sort({ createdAt: -1 })).map((u) => u.toJSON() as unknown as UserDto),
  )
  .route(
    { method: 'get', path: '/:id', summary: 'Ver un usuario', access: 'admin', params: idParams, response: userSchema },
    async ({ params }) => found(await User.findById(params.id), 'Usuario no encontrado').toJSON() as unknown as UserDto,
  )
  .route(
    {
      method: 'put',
      path: '/:id/roles',
      summary: 'Reemplazar los roles de un usuario',
      access: 'admin',
      params: idParams,
      body: setRolesInputSchema,
      response: userSchema,
    },
    async ({ params, body, user }) => {
      if (params.id === user.id && !body.roles.includes('Admin')) {
        throw HttpError.badRequest('No puedes quitarte tu propio rol de administrador');
      }
      const target = found(await User.findById(params.id), 'Usuario no encontrado');
      target.role = [...new Set(body.roles)] as typeof target.role;
      await target.save();
      return target.toJSON() as unknown as UserDto;
    },
  )
  .route(
    { method: 'delete', path: '/:id', summary: 'Borrar un usuario', access: 'admin', params: idParams },
    async ({ params, user }) => {
      if (params.id === user.id) throw HttpError.badRequest('Usa DELETE /me para borrar tu propia cuenta');
      found(await User.findByIdAndDelete(params.id), 'Usuario no encontrado');
    },
  );
