import { z } from 'zod';
import {
  chapterSchema,
  chapterSummarySchema,
  objectId,
  publishedQuerySchema,
  publishChain,
  publishInputSchema,
  updateChapterInputSchema,
  type Chapter as ChapterDto,
  type ChapterSummary,
  type Decision,
} from '@wos/shared';
import { ApiRouter, isWriter, type AuthUser } from '../lib/route.js';
import { HttpError } from '../lib/http-error.js';
import { Npc, type ChapterDoc, type DecisionData, type NpcDoc } from '../models/npc.model.js';
import { assertCanDelete, assertCanEdit, setPublished } from './permissions.js';
import { loadNpc } from './npcs.routes.js';

export const npcChaptersApi = new ApiRouter('/npcs', 'Capítulos');
export const chaptersApi = new ApiRouter('/chapters', 'Capítulos');
/** Modo escritor: /writer/npcs/:npcId/chapters con los capítulos completos */
export const writerNpcChaptersApi = new ApiRouter('/writer/npcs', 'Modo escritor');

const npcParams = z.object({ npcId: objectId });
const chapterParams = z.object({ chapterId: objectId });

/** Carga un capítulo con su NPC; los lectores solo ven capítulos publicados de NPCs publicados */
async function loadChapter(chapterId: string, user?: AuthUser): Promise<{ npc: NpcDoc; chapter: ChapterDoc }> {
  const npc = await Npc.findOne({ 'chapters._id': chapterId });
  const chapter = npc?.chapters.id(chapterId);
  if (!npc || !chapter || !(isWriter(user) || (npc.published && chapter.published))) {
    throw HttpError.notFound('Capítulo no encontrado');
  }
  return { npc, chapter };
}

const isRoot = (npc: NpcDoc, chapter: ChapterDoc) => npc.chapters[0]?._id.equals(chapter._id) ?? false;

/** Publicar o borrar un capítulo: su autor, o el del NPC si el capítulo aún no tiene autor */
const chapterOwner = (npc: NpcDoc, chapter: ChapterDoc) => chapter.author || npc.author;

/** Cada opción es visible para los lectores solo si su capítulo destino está publicado */
function syncOptionVisibility(npc: NpcDoc) {
  for (const c of npc.chapters) {
    for (const option of c.usersDecisions?.options ?? []) {
      option.published = npc.chapters.id(option.value)?.published ?? false;
    }
  }
}

const asChainChapter = (c: ChapterDoc) => ({
  id: c.id as string,
  name: c.name,
  published: c.published,
  decision: c.usersDecisions ? { options: c.usersDecisions.options.map((o) => ({ value: o.value })) } : null,
});

const toSummary = (c: ChapterDoc): ChapterSummary => ({
  id: c.id,
  name: c.name,
  author: c.author,
  published: c.published,
  writeDate: c.writeDate?.toISOString(),
  publishDate: c.publishDate?.toISOString() ?? null,
});

function toDto(npc: NpcDoc, chapter: ChapterDoc, user?: AuthUser): ChapterDto {
  const json = chapter.toJSON() as unknown as Omit<ChapterDto, 'npcId'>;
  const decision = (json.decision as Decision | undefined) ?? null;
  return {
    ...json,
    npcId: npc.id,
    endLocation: json.endLocation ?? null,
    // los lectores no ven opciones que lleven a capítulos sin publicar
    decision: decision && !isWriter(user) ? { ...decision, options: decision.options.filter((o) => o.published) } : decision,
  };
}

type DecisionInput = NonNullable<z.output<typeof updateChapterInputSchema>['decision']>;

/**
 * Construye la decisión del capítulo. Las opciones sin `value` generan un capítulo hijo vacío
 * con el nombre de la opción; las que tienen `value` deben apuntar a un capítulo del mismo NPC.
 */
function buildDecision(npc: NpcDoc, chapter: ChapterDoc, input: DecisionInput): DecisionData {
  const previous = chapter.usersDecisions?.options ?? [];
  const options = input.options.map((o) => {
    let target = o.value ? npc.chapters.id(o.value) : null;
    if (o.value && !target) throw HttpError.badRequest(`La opción "${o.name}" apunta a un capítulo que no existe en este NPC`);
    if (target?._id.equals(chapter._id)) throw HttpError.badRequest(`La opción "${o.name}" no puede apuntar a su propio capítulo`);
    if (!target) {
      npc.chapters.push({ name: o.name, story: [], endLocation: { endChapter: true } });
      target = npc.chapters.at(-1)!;
    }
    return {
      ...(o.id && previous.some((p) => p._id.equals(o.id)) ? { _id: o.id } : {}),
      name: o.name,
      description: o.description,
      value: target.id as string,
      removeItem: o.removeItem ?? false,
      published: target.published,
    };
  });
  return { decisionType: input.decisionType, amount: input.amount, item: input.item, options };
}

writerNpcChaptersApi.route(
  {
    method: 'get',
    path: '/:npcId/chapters',
    summary: 'Listar los capítulos de un NPC completos (modo escritor)',
    description: 'Con sus fragmentos, decisiones y lugar de finalización, también los sin publicar. El primero es el inicio.',
    access: 'writer',
    params: npcParams,
    query: publishedQuerySchema,
    response: z.array(chapterSchema),
  },
  async ({ params, query, user }) => {
    const npc = await loadNpc(params.npcId, user);
    return npc.chapters
      .filter((c) => query.published === undefined || c.published === query.published)
      .map((c) => toDto(npc, c, user));
  },
);

npcChaptersApi.route(
  {
    method: 'get',
    path: '/:npcId/chapters',
    summary: 'Listar capítulos de un NPC',
    description: 'El primer capítulo es el inicio de la historia.',
    params: npcParams,
    query: publishedQuerySchema,
    response: z.array(chapterSummarySchema),
  },
  async ({ params, query, user }) => {
    const npc = await loadNpc(params.npcId, user);
    const published = isWriter(user) ? query.published : true;
    return npc.chapters.filter((c) => published === undefined || c.published === published).map(toSummary);
  },
);

chaptersApi
  .route(
    {
      method: 'get',
      path: '/:chapterId',
      summary: 'Leer capítulo (modo lector)',
      description:
        'Solo capítulos publicados de NPCs publicados, sin las opciones que lleven a capítulos sin publicar. ' +
        'Es igual para todos los usuarios; los capítulos completos están en `GET /writer/npcs/:npcId/chapters`.',
      params: chapterParams,
      response: chapterSchema,
    },
    async ({ params }) => {
      const { npc, chapter } = await loadChapter(params.chapterId);
      return toDto(npc, chapter);
    },
  )
  .route(
    {
      method: 'patch',
      path: '/:chapterId',
      summary: 'Editar capítulo y sus decisiones',
      description:
        'Si una opción de `decision.options` no trae `value`, se crea un capítulo hijo vacío y la opción apunta a él. ' +
        'Enviar `decision: null` convierte el capítulo en final.',
      access: 'writer',
      params: chapterParams,
      body: updateChapterInputSchema,
      response: chapterSchema,
    },
    async ({ params, body, user }) => {
      const { npc, chapter } = await loadChapter(params.chapterId, user);
      assertCanEdit(user, chapter.author);
      if (body.name !== undefined) chapter.name = body.name;
      if (body.items !== undefined) chapter.items = body.items;
      if (body.endLocation !== undefined) chapter.endLocation = body.endLocation;
      if (body.story !== undefined) {
        chapter.story = body.story;
        chapter.author ||= user.username;
        chapter.writeDate = new Date();
      }
      if (body.decision !== undefined) {
        chapter.set('usersDecisions', body.decision ? buildDecision(npc, chapter, body.decision) : null);
      }
      await npc.save();
      return toDto(npc, chapter, user);
    },
  )
  .route(
    {
      method: 'patch',
      path: '/:chapterId/publish',
      summary: 'Publicar o despublicar capítulo',
      description:
        'Publicar un capítulo publica en cadena los capítulos sin publicar a los que llevan sus decisiones (y los que ' +
        'siguen a esos), así ninguna decisión publicada lleva a un capítulo sin publicar. Hay que poder publicarlos todos. ' +
        'Las opciones que llevan a un capítulo sin publicar quedan ocultas para los lectores.',
      access: 'writer',
      params: chapterParams,
      body: publishInputSchema,
      response: chapterSchema,
    },
    async ({ params, body, user }) => {
      const { npc, chapter } = await loadChapter(params.chapterId, user);
      const chain = body.published
        ? publishChain(npc.chapters.map(asChainChapter), chapter.id).map((c) => npc.chapters.id(c.id)!)
        : [chapter];
      assertCanEdit(user, chapterOwner(npc, chapter));
      for (const c of chain) {
        try {
          assertCanEdit(user, chapterOwner(npc, c));
        } catch {
          throw HttpError.forbidden(`No puedes publicar «${c.name}», al que lleva una decisión: es de ${chapterOwner(npc, c)}`);
        }
      }
      for (const c of chain) setPublished(c, body.published);
      syncOptionVisibility(npc);
      await npc.save();
      return toDto(npc, chapter, user);
    },
  )
  .route(
    {
      method: 'delete',
      path: '/:chapterId',
      summary: 'Borrar capítulo',
      description: 'Quita también las opciones que llevaban a él. El capítulo inicial no se puede borrar.',
      access: 'writer',
      params: chapterParams,
    },
    async ({ params, user }) => {
      const { npc, chapter } = await loadChapter(params.chapterId, user);
      if (isRoot(npc, chapter)) throw HttpError.conflict('El capítulo inicial no se puede borrar');
      assertCanDelete(user, chapterOwner(npc, chapter));
      for (const c of npc.chapters) {
        const options = c.usersDecisions?.options;
        if (options?.some((o) => o.value === chapter.id)) {
          c.set('usersDecisions.options', options.filter((o) => o.value !== chapter.id));
        }
      }
      chapter.deleteOne();
      await npc.save();
    },
  );
