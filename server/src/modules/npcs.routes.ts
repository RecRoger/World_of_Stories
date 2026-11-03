import { z } from 'zod';
import {
  createNpcInputSchema,
  npcSchema,
  npcSummarySchema,
  objectId,
  publishedQuerySchema,
  publishInputSchema,
  updateNpcInputSchema,
  type Decision,
  type Npc as NpcDto,
  type NpcSummary,
  type Readable,
} from '@wos/shared';
import { ApiRouter, isWriter, type AuthUser } from '../lib/route.js';
import { HttpError } from '../lib/http-error.js';
import { City } from '../models/city.model.js';
import { Npc, type DecisionData, type IDecision, type NpcDoc } from '../models/npc.model.js';
import { assertCanDelete, assertCanEdit, setPublished } from './permissions.js';
import { loadPlace } from './places.routes.js';

export const placeNpcsApi = new ApiRouter('/places', 'NPCs');
export const npcsApi = new ApiRouter('/npcs', 'NPCs');

const placeParams = z.object({ placeId: objectId });
const npcParams = z.object({ npcId: objectId });

type DecisionInput = z.output<typeof createNpcInputSchema>['decision'];

/** Carga un NPC; los lectores solo ven NPCs publicados */
export async function loadNpc(npcId: string, user?: AuthUser): Promise<NpcDoc> {
  const npc = await Npc.findById(npcId);
  if (!npc || !(npc.published || isWriter(user))) throw HttpError.notFound('NPC no encontrado');
  return npc;
}

/** Las opciones de la decisión del NPC no apuntan a capítulos, así que siempre son visibles */
function npcDecision(input: NonNullable<DecisionInput>, previous?: IDecision | null): DecisionData {
  return {
    decisionType: input.decisionType,
    amount: input.amount,
    item: input.item,
    options: input.options.map((o) => ({
      ...(o.id && previous?.options.some((p) => p._id.equals(o.id)) ? { _id: o.id } : {}),
      name: o.name,
      description: o.description,
      value: o.value ?? '',
      removeItem: o.removeItem ?? false,
      published: true,
    })),
  };
}

const newTale = (tale: Readable[], author: string) => ({ tale, author, published: false, writeDate: new Date() });

const toSummary = (n: NpcDoc): NpcSummary => ({
  id: n.id,
  name: n.name,
  npcType: n.npcType,
  title: n.title,
  author: n.author,
  published: n.published,
  publishDate: n.publishDate?.toISOString() ?? null,
});

function toDto(npc: NpcDoc): NpcDto {
  const { chapters: _chapters, ...json } = npc.toJSON() as unknown as NpcDto & { chapters?: unknown };
  return {
    ...json,
    placeId: npc.placeId?.toString(),
    description: json.description ?? null,
    meeting: json.meeting ?? null,
    rejected: json.rejected ?? null,
    decision: (json.decision as Decision | undefined) ?? null,
  };
}

placeNpcsApi
  .route(
    {
      method: 'get',
      path: '/:placeId/npcs',
      summary: 'Listar NPCs de un lugar',
      params: placeParams,
      query: publishedQuerySchema,
      response: z.array(npcSummarySchema),
    },
    async ({ params, query, user }) => {
      const { place } = await loadPlace(params.placeId, user);
      const published = isWriter(user) ? query.published : true;
      const npcs = await Npc.find(
        { _id: { $in: place.events }, ...(published === undefined ? {} : { published }) },
        { chapters: 0 },
      ).sort({ name: 1 });
      return npcs.map(toSummary);
    },
  )
  .route(
    {
      method: 'post',
      path: '/:placeId/npcs',
      summary: 'Crear NPC en un lugar',
      description: 'Se crea con un primer capítulo vacío ("Inicio") desde el que se ramifica la historia.',
      access: 'writer',
      params: placeParams,
      body: createNpcInputSchema,
      response: npcSchema,
      status: 201,
    },
    async ({ params, body, user }) => {
      const { city, place } = await loadPlace(params.placeId, user);
      const npc = await Npc.create({
        name: body.name,
        npcType: body.npcType,
        title: body.title,
        placeId: place._id,
        description: newTale(body.description, user.username),
        meeting: newTale(body.meeting, user.username),
        rejected: newTale(body.rejected, user.username),
        decision: body.decision ? npcDecision(body.decision) : null,
        items: body.items ?? [],
        chapters: [{ name: 'Inicio', story: [], endLocation: { endChapter: true } }],
        author: user.username,
      });
      place.events.push(npc._id);
      await city.save();
      return toDto(npc);
    },
  );

npcsApi
  .route(
    { method: 'get', path: '/:npcId', summary: 'Ver NPC (sin capítulos)', params: npcParams, response: npcSchema },
    async ({ params, user }) => toDto(await loadNpc(params.npcId, user)),
  )
  .route(
    {
      method: 'patch',
      path: '/:npcId',
      summary: 'Editar NPC',
      access: 'writer',
      params: npcParams,
      body: updateNpcInputSchema,
      response: npcSchema,
    },
    async ({ params, body, user }) => {
      const npc = await loadNpc(params.npcId, user);
      assertCanEdit(user, npc.author);
      const { description, meeting, rejected, decision, ...fields } = body;
      npc.set(fields);
      for (const [key, tale] of [['description', description], ['meeting', meeting], ['rejected', rejected]] as const) {
        if (!tale) continue;
        const current = npc[key];
        if (current) {
          current.tale = tale;
          current.writeDate = new Date();
        } else {
          npc.set(key, newTale(tale, user.username));
        }
      }
      if (decision) npc.set('decision', npcDecision(decision, npc.decision));
      await npc.save();
      return toDto(npc);
    },
  )
  .route(
    {
      method: 'patch',
      path: '/:npcId/publish',
      summary: 'Publicar o despublicar NPC',
      access: 'writer',
      params: npcParams,
      body: publishInputSchema,
      response: npcSchema,
    },
    async ({ params, body, user }) => {
      const npc = await loadNpc(params.npcId, user);
      assertCanEdit(user, npc.author);
      setPublished(npc, body.published);
      for (const tale of [npc.description, npc.meeting, npc.rejected]) {
        if (tale) setPublished(tale, body.published);
      }
      await npc.save();
      return toDto(npc);
    },
  )
  .route(
    { method: 'delete', path: '/:npcId', summary: 'Borrar NPC', access: 'writer', params: npcParams },
    async ({ params, user }) => {
      const npc = await loadNpc(params.npcId, user);
      assertCanDelete(user, npc.author);
      await City.updateOne({ 'places.events': npc._id }, { $pull: { 'places.$.events': npc._id } });
      await npc.deleteOne();
    },
  );
