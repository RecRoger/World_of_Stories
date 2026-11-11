import { z } from 'zod';
import {
  becomeWriterInputSchema,
  characterSchema,
  createCharacterInputSchema,
  markReadInputSchema,
  objectId,
  updateCharacterInputSchema,
  updateMeInputSchema,
  userSchema,
  type Character,
  type User as UserDto,
  type Whereabouts,
} from '@wos/shared';
import { ApiRouter } from '../lib/route.js';
import { HttpError, found } from '../lib/http-error.js';
import { checkPassword, clearAuthCookie, hashPassword } from '../lib/auth.js';
import { env } from '../config/env.js';
import { City } from '../models/city.model.js';
import { Npc } from '../models/npc.model.js';
import { User, type ICharacter } from '../models/user.model.js';
import { renameAuthor } from './authors.js';

export const meApi = new ApiRouter('/me', 'Mi cuenta');

const loadMe = async (id: string, withPassword = false) =>
  found(await User.findById(id).select(withPassword ? '+password' : ''), 'Usuario no encontrado');

const characterParams = z.object({ characterId: objectId });
const MAX_CHARACTERS = 10;

/** Nombres de la ciudad, lugar, NPC y capítulo donde está el personaje (null si aún no ha viajado) */
async function whereabouts(location: ICharacter['location']): Promise<Whereabouts | null> {
  if (!location?.cityId) return null;
  const [city, npc] = await Promise.all([
    City.findById(location.cityId, 'name places._id places.name').catch(() => null),
    location.npcId ? Npc.findById(location.npcId, 'name chapters._id chapters.name').catch(() => null) : null,
  ]);
  if (!city) return null;
  const place = location.placeId ? city.places.id(location.placeId) : null;
  const chapter = npc && location.chapterId ? npc.chapters.id(location.chapterId) : null;
  return {
    kind: chapter ? 'chapter' : npc ? 'npc' : place ? 'place' : 'city',
    city: city.name,
    place: place?.name ?? null,
    npc: npc?.name ?? null,
    chapter: chapter?.name ?? null,
  };
}

/** Personaje con los nombres de su ubicación */
async function toCharacter(character: ICharacter & { toJSON(): unknown }): Promise<Character> {
  const json = character.toJSON() as Character;
  return { ...json, whereabouts: await whereabouts(character.location) };
}

meApi
  .route(
    { method: 'get', path: '/', summary: 'Usuario con sesión iniciada', access: 'user', response: userSchema },
    async ({ user }) => (await loadMe(user.id)).toJSON() as unknown as UserDto,
  )
  .route(
    {
      method: 'patch',
      path: '/',
      summary: 'Editar mi cuenta',
      description: 'Cambiar email o contraseña requiere `currentPassword`.',
      access: 'user',
      body: updateMeInputSchema,
      response: userSchema,
    },
    async ({ user, body }) => {
      const me = await loadMe(user.id, true);
      const sensitive = (body.email && body.email !== me.email) || body.password;
      if (sensitive && !(body.currentPassword && (await checkPassword(body.currentPassword, me.password)))) {
        throw HttpError.forbidden('La contraseña actual es incorrecta');
      }

      const oldUsername = me.username;
      if (body.email) me.email = body.email;
      if (body.username) me.username = body.username;
      if (body.password) me.password = await hashPassword(body.password);
      await me.save(); // el índice único devuelve 409 si el email/username ya existe

      if (me.username !== oldUsername) await renameAuthor(oldUsername, me.username);
      return me.toJSON() as unknown as UserDto;
    },
  )
  .route({ method: 'delete', path: '/', summary: 'Borrar mi cuenta', access: 'user' }, async ({ user, res }) => {
    await User.findByIdAndDelete(user.id);
    clearAuthCookie(res);
  })
  .route(
    {
      method: 'post',
      path: '/become-writer',
      summary: 'Obtener el rol de escritor con el código de invitación',
      access: 'user',
      body: becomeWriterInputSchema,
      response: userSchema,
    },
    async ({ user, body }) => {
      if (!env.WRITER_INVITE_CODE || body.code !== env.WRITER_INVITE_CODE) {
        throw HttpError.forbidden('Código de escritor incorrecto');
      }
      const me = await loadMe(user.id);
      if (!me.role.includes('Writer')) me.role.push('Writer');
      await me.save();
      return me.toJSON() as unknown as UserDto;
    },
  );

// --- Personajes (progreso de lectura) ---

meApi
  .route(
    {
      method: 'get',
      path: '/characters',
      summary: 'Mis personajes',
      access: 'user',
      response: z.array(characterSchema),
    },
    async ({ user }) => Promise.all((await loadMe(user.id)).characters.map(toCharacter)),
  )
  .route(
    {
      method: 'post',
      path: '/characters',
      summary: 'Crear personaje',
      access: 'user',
      body: createCharacterInputSchema,
      response: characterSchema,
      status: 201,
    },
    async ({ user, body }) => {
      const me = await loadMe(user.id);
      if (me.characters.length >= MAX_CHARACTERS) {
        throw HttpError.conflict(`Máximo ${MAX_CHARACTERS} personajes por cuenta`);
      }
      me.characters.push({ name: body.name ?? '' });
      await me.save();
      return toCharacter(me.characters.at(-1)!);
    },
  )
  .route(
    {
      method: 'patch',
      path: '/characters/:characterId',
      summary: 'Actualizar personaje (ubicación, dinero, objetos...)',
      access: 'user',
      params: characterParams,
      body: updateCharacterInputSchema,
      response: characterSchema,
    },
    async ({ user, params, body }) => {
      const me = await loadMe(user.id);
      const character = found(me.characters.id(params.characterId), 'Personaje no encontrado');
      character.set(body);
      await me.save();
      return toCharacter(character);
    },
  )
  .route(
    {
      method: 'post',
      path: '/characters/:characterId/read',
      summary: 'Marcar un fragmento como leído',
      access: 'user',
      params: characterParams,
      body: markReadInputSchema,
      response: characterSchema,
    },
    async ({ user, params, body }) => {
      const me = await loadMe(user.id);
      const character = found(me.characters.id(params.characterId), 'Personaje no encontrado');
      if (!character.fragmentsRead.includes(body.fragmentId)) character.fragmentsRead.push(body.fragmentId);
      await me.save();
      return toCharacter(character);
    },
  )
  .route(
    {
      method: 'delete',
      path: '/characters/:characterId',
      summary: 'Borrar personaje',
      access: 'user',
      params: characterParams,
    },
    async ({ user, params }) => {
      const me = await loadMe(user.id);
      found(me.characters.id(params.characterId), 'Personaje no encontrado').deleteOne();
      await me.save();
    },
  );
