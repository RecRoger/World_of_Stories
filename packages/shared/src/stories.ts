import { z } from 'zod';
import { isoDate, narrativeSchema, objectId, readableInputSchema, readableSchema, taleSchema } from './common.js';

export const DECISION_TYPES = ['choose', 'item', 'money'] as const;
export const NPC_TYPES = ['story', 'store', 'travel'] as const;
export type NpcType = (typeof NPC_TYPES)[number];

/**
 * Un NPC de tipo `story` con decisión `choose` tiene exactamente dos opciones:
 * la primera acepta (empieza la historia) y la segunda la rechaza.
 */
export const STORY_OPTIONS = 2;

export const decisionOptionSchema = z
  .object({
    id: objectId,
    name: z.string(),
    description: z.string(),
    value: z.string().meta({ description: 'ID del capítulo destino' }),
    published: z.boolean(),
    removeItem: z.boolean().nullish(),
  })
  .meta({ id: 'DecisionOption' });
export type DecisionOption = z.infer<typeof decisionOptionSchema>;

export const decisionSchema = z
  .object({
    decisionType: z.string().nullish().meta({ description: `Normalmente uno de: ${DECISION_TYPES.join(', ')}` }),
    amount: z.number().nullish(),
    item: z.string().nullish(),
    options: z.array(decisionOptionSchema),
  })
  .meta({ id: 'Decision' });
export type Decision = z.infer<typeof decisionSchema>;

export const decisionOptionInputSchema = z
  .object({
    id: objectId.optional().meta({ description: 'Si se omite, se crea una opción nueva' }),
    name: z.string().trim().min(1).max(80),
    description: z.string().trim().min(1).max(500),
    value: objectId.optional().meta({
      description: 'Capítulo destino. En capítulos, si se omite se crea un capítulo hijo vacío.',
    }),
    removeItem: z.boolean().optional(),
  })
  .meta({ id: 'DecisionOptionInput' });

export const decisionInputSchema = z
  .object({
    decisionType: z.enum(DECISION_TYPES).default('choose'),
    amount: z.number().int().min(0).optional(),
    item: z.string().trim().max(80).optional(),
    options: z.array(decisionOptionInputSchema).max(10).default([]),
  })
  .meta({ id: 'DecisionInput' });
export type DecisionInput = z.input<typeof decisionInputSchema>;

export const npcSummarySchema = z
  .object({
    id: objectId,
    name: z.string(),
    npcType: z.string(),
    title: z.string().optional(),
    author: z.string(),
    published: z.boolean(),
    publishDate: isoDate.nullish(),
  })
  .meta({ id: 'NpcSummary' });
export type NpcSummary = z.infer<typeof npcSummarySchema>;

export const npcSchema = npcSummarySchema
  .extend({
    placeId: objectId.optional(),
    description: taleSchema.nullable(),
    meeting: taleSchema.nullable(),
    rejected: taleSchema.nullable(),
    decision: decisionSchema.nullable(),
    items: z.array(z.string()),
    writeDate: isoDate.optional(),
  })
  .meta({ id: 'Npc' });
export type Npc = z.infer<typeof npcSchema>;

/**
 * NPC en modo lector: solo NPCs publicados, con sus textos (descripción, encuentro y rechazo) y las opciones
 * visibles de su decisión. Es igual para todos los usuarios.
 */
export const npcReadingSchema = z
  .object({
    id: objectId,
    placeId: objectId,
    name: z.string(),
    npcType: z.string(),
    title: z.string().optional(),
    author: z.string(),
    description: taleSchema.nullable(),
    meeting: taleSchema.nullable(),
    rejected: taleSchema.nullable(),
    decision: decisionSchema.nullable(),
  })
  .meta({ id: 'NpcReading' });
export type NpcReading = z.infer<typeof npcReadingSchema>;

export const createNpcInputSchema = z
  .object({
    name: z.string().trim().min(1).max(80),
    npcType: z.enum(NPC_TYPES).default('story'),
    title: z.string().trim().max(120).optional(),
    description: narrativeSchema,
    meeting: narrativeSchema,
    rejected: narrativeSchema,
    decision: decisionInputSchema.optional(),
    items: z.array(z.string()).optional(),
  })
  .meta({ id: 'CreateNpcInput' });
export type CreateNpcInput = z.input<typeof createNpcInputSchema>;

export const updateNpcInputSchema = z
  .object({
    name: z.string().trim().min(1).max(80).optional(),
    npcType: z.enum(NPC_TYPES).optional(),
    title: z.string().trim().max(120).optional(),
    description: narrativeSchema.optional(),
    meeting: narrativeSchema.optional(),
    rejected: narrativeSchema.optional(),
    decision: decisionInputSchema.optional(),
    items: z.array(z.string()).optional(),
  })
  .meta({ id: 'UpdateNpcInput' });
export type UpdateNpcInput = z.input<typeof updateNpcInputSchema>;

export const endLocationSchema = z
  .object({
    endChapter: z.boolean().nullish(),
    cityId: z.string().nullish(),
    placeId: z.string().nullish(),
  })
  .meta({ id: 'EndLocation' });
export type EndLocation = z.infer<typeof endLocationSchema>;

export const endLocationInputSchema = z
  .object({
    endChapter: z.boolean().optional(),
    cityId: objectId.optional(),
    placeId: objectId.optional(),
  })
  .meta({ id: 'EndLocationInput' });

export const chapterSummarySchema = z
  .object({
    id: objectId,
    name: z.string(),
    author: z.string().optional(),
    published: z.boolean(),
    writeDate: isoDate.optional(),
    publishDate: isoDate.nullish(),
  })
  .meta({ id: 'ChapterSummary' });
export type ChapterSummary = z.infer<typeof chapterSummarySchema>;

export const chapterSchema = chapterSummarySchema
  .extend({
    npcId: objectId,
    story: z.array(readableSchema),
    decision: decisionSchema.nullable(),
    endLocation: endLocationSchema.nullable(),
    items: z.array(z.string()),
  })
  .meta({ id: 'Chapter' });
export type Chapter = z.infer<typeof chapterSchema>;

type ChainChapter = { id: string; name: string; published: boolean; decision?: { options: { value: string }[] } | null };

/**
 * Capítulos que se publican al publicar `startId`: él y todos los que se alcanzan desde sus decisiones,
 * los que aún no estén publicados. Así ninguna decisión publicada lleva a un capítulo sin publicar.
 */
export function publishChain<C extends ChainChapter>(chapters: C[], startId: string): C[] {
  const byId = new Map(chapters.map((c) => [c.id, c]));
  const seen = new Set<string>();
  const pending = [startId];
  const chain: C[] = [];
  while (pending.length) {
    const chapter = byId.get(pending.pop()!);
    if (!chapter || seen.has(chapter.id)) continue;
    seen.add(chapter.id);
    if (!chapter.published) chain.push(chapter);
    for (const option of chapter.decision?.options ?? []) pending.push(option.value);
  }
  return chain;
}

export const updateChapterInputSchema = z
  .object({
    name: z.string().trim().min(1).max(80).optional(),
    story: z.array(readableInputSchema).max(200).optional(),
    items: z.array(z.string()).optional(),
    endLocation: endLocationInputSchema.nullable().optional(),
    decision: decisionInputSchema.nullable().optional(),
  })
  .meta({ id: 'UpdateChapterInput' });
export type UpdateChapterInput = z.input<typeof updateChapterInputSchema>;
