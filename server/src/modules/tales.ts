import { z, type ZodObject } from 'zod';
import type { Types } from 'mongoose';
import { objectId, publishInputSchema, taleInputSchema, taleSchema, type Tale } from '@wos/shared';
import { found } from '../lib/http-error.js';
import type { ApiRouter } from '../lib/route.js';
import type { ITale } from '../models/tale.model.js';
import { assertCanDelete, assertCanEdit, setPublished } from './permissions.js';

interface TaleTarget {
  /** Documento raíz que hay que guardar tras modificar la lista */
  root: { save(): Promise<unknown> };
  list: Types.DocumentArray<ITale>;
}

interface TaleRoutesOptions<P extends ZodObject> {
  /** Ruta de la colección de relatos, p. ej. `/:cityId/description` */
  path: string;
  params: P;
  /** Nombre para documentación y mensajes, p. ej. "descripción de la ciudad" */
  label: string;
  load: (params: z.output<P>) => Promise<TaleTarget>;
}

/** Registra alta, edición, publicación y borrado de versiones de un relato */
export function registerTaleRoutes<P extends ZodObject>(api: ApiRouter, opts: TaleRoutesOptions<P>) {
  const withTale = opts.params.extend({ taleId: objectId });
  const getTale = (list: Types.DocumentArray<ITale>, id: string) =>
    found(list.id(id), `No se encontró esa versión de ${opts.label}`);

  api
    .route(
      {
        method: 'post',
        path: opts.path,
        summary: `Añadir una versión de ${opts.label}`,
        access: 'writer',
        params: opts.params,
        body: taleInputSchema,
        response: taleSchema,
        status: 201,
      },
      async ({ params, body, user }) => {
        const { root, list } = await opts.load(params);
        list.push({ tale: body.tale, author: user.username, published: false, writeDate: new Date() });
        await root.save();
        return list.at(-1)!.toJSON() as unknown as Tale;
      },
    )
    .route(
      {
        method: 'patch',
        path: `${opts.path}/:taleId`,
        summary: `Editar una versión de ${opts.label}`,
        access: 'writer',
        params: withTale,
        body: taleInputSchema,
        response: taleSchema,
      },
      async ({ params, body, user }) => {
        const { root, list } = await opts.load(params as z.output<P>);
        const tale = getTale(list, params.taleId as string);
        assertCanEdit(user, tale.author);
        tale.tale = body.tale;
        tale.writeDate = new Date();
        await root.save();
        return tale.toJSON() as unknown as Tale;
      },
    )
    .route(
      {
        method: 'patch',
        path: `${opts.path}/:taleId/publish`,
        summary: `Publicar o despublicar una versión de ${opts.label}`,
        access: 'writer',
        params: withTale,
        body: publishInputSchema,
        response: taleSchema,
      },
      async ({ params, body, user }) => {
        const { root, list } = await opts.load(params as z.output<P>);
        const tale = getTale(list, params.taleId as string);
        assertCanEdit(user, tale.author);
        setPublished(tale, body.published);
        await root.save();
        return tale.toJSON() as unknown as Tale;
      },
    )
    .route(
      {
        method: 'delete',
        path: `${opts.path}/:taleId`,
        summary: `Borrar una versión de ${opts.label}`,
        access: 'writer',
        params: withTale,
      },
      async ({ params, user }) => {
        const { root, list } = await opts.load(params as z.output<P>);
        const tale = getTale(list, params.taleId as string);
        assertCanDelete(user, tale.author);
        tale.deleteOne();
        await root.save();
      },
    );
}

/** Los lectores solo ven las versiones publicadas */
export function visibleTales<T extends { published: boolean }>(tales: T[], canSeeDrafts: boolean): T[] {
  return canSeeDrafts ? tales : tales.filter((t) => t.published);
}
