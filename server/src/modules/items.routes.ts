import { z } from 'zod';
import { createItemInputSchema, itemSchema, objectId, updateItemInputSchema, type Item as ItemDto } from '@wos/shared';
import { ApiRouter } from '../lib/route.js';
import { HttpError, found } from '../lib/http-error.js';
import { Item, ITEM_NAME_COLLATION, type ItemDoc } from '../models/item.model.js';
import { Npc } from '../models/npc.model.js';
import { assertCanDelete, assertCanEdit } from './permissions.js';

/** Catálogo de objetos (modo escritor): cualquier escritor crea; editar y borrar, su autor o un admin */
export const itemsApi = new ApiRouter('/items', 'Objetos');

const itemParams = z.object({ itemId: objectId });
const toDto = (item: ItemDoc) => item.toJSON() as unknown as ItemDto;

/** Los nombres son únicos sin distinguir mayúsculas ni acentos */
async function assertFreeName(name: string, except?: string) {
  const taken = await Item.findOne({ name, ...(except ? { _id: { $ne: except } } : {}) }).collation(ITEM_NAME_COLLATION);
  if (taken) throw HttpError.conflict(`Ya existe un objeto llamado «${taken.name}»`);
}

itemsApi
  .route(
    {
      method: 'get',
      path: '/',
      summary: 'Listar los objetos del catálogo',
      description: 'Ordenados por nombre. Lo ve cualquier usuario con sesión (el lector necesita los nombres de los objetos).',
      access: 'user',
      response: z.array(itemSchema),
    },
    async () => (await Item.find().collation(ITEM_NAME_COLLATION).sort({ name: 1 })).map(toDto),
  )
  .route(
    {
      method: 'post',
      path: '/',
      summary: 'Crear un objeto',
      access: 'writer',
      body: createItemInputSchema,
      response: itemSchema,
      status: 201,
    },
    async ({ body, user }) => {
      await assertFreeName(body.name);
      return toDto(await Item.create({ ...body, author: user.username }));
    },
  )
  .route(
    {
      method: 'patch',
      path: '/:itemId',
      summary: 'Editar un objeto (su autor o un admin)',
      access: 'writer',
      params: itemParams,
      body: updateItemInputSchema,
      response: itemSchema,
    },
    async ({ params, body, user }) => {
      const item = found(await Item.findById(params.itemId), 'Objeto no encontrado');
      assertCanEdit(user, item.author);
      if (body.name !== undefined && body.name !== item.name) await assertFreeName(body.name, item.id);
      item.set(body);
      await item.save();
      return toDto(item);
    },
  )
  .route(
    { method: 'delete', path: '/:itemId', summary: 'Borrar un objeto (su autor o un admin)', access: 'writer', params: itemParams },
    async ({ params, user }) => {
      const item = found(await Item.findById(params.itemId), 'Objeto no encontrado');
      assertCanDelete(user, item.author);
      const usedBy = await Npc.findOne(
        { $or: [{ 'decision.item': item.id }, { 'chapters.usersDecisions.item': item.id }, { 'chapters.reward.items.itemId': item.id }] },
        'name',
      );
      if (usedBy) throw HttpError.conflict(`«${item.name}» está en uso en «${usedBy.name}»: quítalo de sus decisiones y recompensas antes de borrarlo`);
      await item.deleteOne();
    },
  );
