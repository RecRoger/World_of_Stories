import mongoose from 'mongoose';
import { z } from 'zod';
import {
  becomeWriterInputSchema,
  characterSchema,
  claimRewardInputSchema,
  claimRewardResultSchema,
  markReadInputSchema,
  objectId,
  optionCost,
  optionItem,
  payInputSchema,
  updateCharacterInputSchema,
  updateMeInputSchema,
  userSchema,
  type Character,
  type PayInput,
  type User as UserDto,
  type Whereabouts,
} from '@wos/shared';
import { ApiRouter } from '../lib/route.js';
import { HttpError, found } from '../lib/http-error.js';
import { checkPassword, clearAuthCookie, hashPassword } from '../lib/auth.js';
import { env } from '../config/env.js';
import { City } from '../models/city.model.js';
import { Npc } from '../models/npc.model.js';
import { Item } from '../models/item.model.js';
import { User, type ICharacter } from '../models/user.model.js';
import { renameAuthor } from './authors.js';
import { addItem, inventoryOf, quantityOf, removeItem } from './inventory.js';

export const meApi = new ApiRouter('/me', 'Mi cuenta');

const loadMe = async (id: string, withPassword = false) =>
  found(await User.findById(id).select(withPassword ? '+password' : ''), 'Usuario no encontrado');

const characterParams = z.object({ characterId: objectId });

/**
 * Los personajes van dentro del usuario: dos cambios a la vez (p. ej. marcar el capítulo como leído y cobrar su
 * recompensa al terminar de leerlo) chocan al guardar (VersionError). Se reintenta con el usuario recargado.
 */
async function retrying<T>(change: () => Promise<T>, attempts = 3): Promise<T> {
  for (let i = 1; ; i++) {
    try {
      return await change();
    } catch (err) {
      if (!(err instanceof mongoose.Error.VersionError) || i >= attempts) throw err;
    }
  }
}
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

/** Personaje con los nombres de su ubicación y su inventario con los datos del catálogo */
async function toCharacter(character: ICharacter & { toJSON(): unknown }): Promise<Character> {
  // Los personajes ya no tienen nombre (los guardados antes pueden traerlo en la base); `rewardsClaimed` es interno
  const { name: _name, rewardsClaimed: _claimed, ...json } = character.toJSON() as Character & { name?: unknown; rewardsClaimed?: unknown };
  const [where, items] = await Promise.all([whereabouts(character.location), inventoryOf(character)]);
  return { ...json, items, whereabouts: where };
}


/**
 * Elegir la opción que cuesta algo en una decisión (dinero o un objeto). El personaje tiene que estar en esa decisión
 * (el encuentro del NPC, o `chapterId`); la opción tiene que llevar a un capítulo publicado.
 */
function takeOption(userId: string, characterId: string, body: PayInput, kind: 'money' | 'item') {
  return retrying(async () => {
    const me = await loadMe(userId);
    const character = found(me.characters.id(characterId), 'Personaje no encontrado');
    const here = character.location;
    if (!here?.cityId || here.npcId !== body.npcId || (here.chapterId ?? undefined) !== body.chapterId) {
      throw HttpError.conflict('El personaje no está en esa decisión');
    }

    const npc = await Npc.findById(body.npcId);
    const chapter = body.chapterId ? npc?.chapters.id(body.chapterId) : null;
    if (!npc?.published || (body.chapterId && !chapter?.published)) throw HttpError.notFound('Decisión no encontrada');
    const decision = chapter ? chapter.usersDecisions : npc.decision;
    const index = decision?.options.findIndex((o) => o._id.equals(body.optionId)) ?? -1;
    const option = decision?.options[index];
    if (!option?.published) throw HttpError.notFound('Opción no encontrada');

    if (kind === 'money') {
      const cost = optionCost(decision, index);
      if (!cost) throw HttpError.badRequest('Esa opción no se paga');
      if (character.money < cost) throw HttpError.conflict(`No tienes suficientes monedas: cuesta ${cost} y tienes ${character.money}`);
      character.money -= cost;
    } else {
      const itemId = optionItem(decision, index);
      if (!itemId) throw HttpError.badRequest('Esa opción no usa ningún objeto');
      if (quantityOf(character, itemId) < 1) {
        const item = await Item.findById(itemId);
        throw HttpError.conflict(`No tienes ${item ? `«${item.name}»` : 'ese objeto'}`);
      }
      if (option.removeItem) removeItem(character, itemId);
    }

    const target = npc.chapters.id(option.value);
    if (!target?.published) throw HttpError.notFound('El capítulo de esa opción no está disponible');
    character.location = { cityId: here.cityId, placeId: here.placeId, npcId: npc.id, chapterId: target.id };
    await me.save();
    return toCharacter(character);
  });
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
      response: characterSchema,
      status: 201,
    },
    async ({ user }) => {
      const me = await loadMe(user.id);
      if (me.characters.length >= MAX_CHARACTERS) {
        throw HttpError.conflict(`Máximo ${MAX_CHARACTERS} personajes por cuenta`);
      }
      me.characters.push({});
      await me.save();
      return toCharacter(me.characters.at(-1)!);
    },
  )
  .route(
    {
      method: 'patch',
      path: '/characters/:characterId',
      summary: 'Actualizar personaje (ubicación, objetos, animaciones...)',
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
      path: '/characters/:characterId/pay',
      summary: 'Pagar para elegir la opción de una decisión de dinero',
      description:
        'El personaje debe estar en la decisión (el encuentro del NPC, o el capítulo indicado) y tener dinero suficiente: ' +
        'se descuenta el monto y pasa al capítulo de la opción. El dinero solo cambia así, no con `PATCH`.',
      access: 'user',
      params: characterParams,
      body: payInputSchema,
      response: characterSchema,
    },
    ({ user, params, body }) => takeOption(user.id, params.characterId, body, 'money'),
  )
  .route(
    {
      method: 'post',
      path: '/characters/:characterId/use-item',
      summary: 'Usar un objeto para elegir la opción de una decisión de objeto',
      description:
        'El personaje debe estar en la decisión y tener el objeto que pide. Si la opción tiene `removeItem`, se gasta uno. ' +
        'Pasa al capítulo de la opción. El inventario solo cambia así y con las recompensas, no con `PATCH`.',
      access: 'user',
      params: characterParams,
      body: payInputSchema,
      response: characterSchema,
    },
    ({ user, params, body }) => takeOption(user.id, params.characterId, body, 'item'),
  )
  .route(
    {
      method: 'post',
      path: '/characters/:characterId/reward',
      summary: 'Cobrar la recompensa del capítulo al terminar de leerlo',
      description:
        'El personaje debe estar en ese capítulo. Dinero y objetos comunes: se ganan la primera vez que lee el capítulo, o al ' +
        'releerlo si no le queda (dinero: si tiene menos de lo que da; objeto común: si no tiene ninguno). Un objeto único, ' +
        'solo si no lo tiene. `gained` dice lo que ganó (puede ser nada).',
      access: 'user',
      params: characterParams,
      body: claimRewardInputSchema,
      response: claimRewardResultSchema,
    },
    ({ user, params, body }) => retrying(async () => {
      const me = await loadMe(user.id);
      const character = found(me.characters.id(params.characterId), 'Personaje no encontrado');
      if (character.location?.chapterId !== body.chapterId) throw HttpError.conflict('El personaje no está en ese capítulo');
      const npc = await Npc.findOne({ 'chapters._id': body.chapterId });
      const chapter = npc?.chapters.id(body.chapterId);
      if (!npc?.published || !chapter?.published) throw HttpError.notFound('Capítulo no encontrado');

      const reward = chapter.reward;
      const first = !character.rewardsClaimed.includes(chapter.id);
      const gained = { money: 0, items: [] as { itemId: string; name: string; quantity: number }[] };
      if (reward?.type === 'money' && reward.amount) {
        if (first || character.money < reward.amount) {
          gained.money = reward.amount;
          character.money += reward.amount;
        }
      } else if (reward?.type === 'item') {
        const stacks = reward.items ?? [];
        const catalog = await Item.find({ _id: { $in: stacks.map((s) => s.itemId) } });
        for (const { itemId, quantity } of stacks) {
          const item = catalog.find((i) => i.id === itemId);
          if (!item) continue; // borrado del catálogo
          if (item.stackable && !first && quantityOf(character, itemId) > 0) continue;
          const added = addItem(character, itemId, quantity, item.stackable);
          if (added) gained.items.push({ itemId, name: item.name, quantity: added });
        }
      }
      if (reward && first) character.rewardsClaimed.push(chapter.id);
      if (gained.money || gained.items.length || (reward && first)) await me.save();
      return { character: await toCharacter(character), gained };
    }),
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
    ({ user, params, body }) => retrying(async () => {
      const me = await loadMe(user.id);
      const character = found(me.characters.id(params.characterId), 'Personaje no encontrado');
      if (!character.fragmentsRead.includes(body.fragmentId)) character.fragmentsRead.push(body.fragmentId);
      await me.save();
      return toCharacter(character);
    }),
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
