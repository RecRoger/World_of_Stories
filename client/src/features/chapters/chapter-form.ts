import { z } from 'zod';
import { ANIMATIONS, type Chapter, type UpdateChapterInput } from '@wos/shared';
import { asAnimation } from './animations';

/** Valor del destino de una decisión que pide crear un capítulo nuevo (vacío, con el nombre de la opción). */
export const NEW_CHAPTER = '';

/*
 * Valores del formulario de un capítulo. Un capítulo final termina en una ciudad o un lugar; si no, continúa con
 * decisiones, y cada una lleva a un capítulo existente o a uno nuevo que se crea al guardar.
 */
export const chapterFormSchema = z
  .object({
    name: z.string().trim().min(1, 'El nombre es obligatorio').max(80),
    fragments: z.array(z.object({ text: z.string().max(5000), animation: z.enum(ANIMATIONS) })),
    isFinal: z.boolean(),
    decisions: z.array(
      z.object({
        id: z.string().optional(),
        name: z.string().trim().max(80),
        description: z.string().trim().max(500),
        target: z.string(),
      }),
    ),
    endKind: z.enum(['city', 'place']),
    cityId: z.string(),
    placeId: z.string(),
  })
  .superRefine((v, ctx) => {
    if (v.isFinal) {
      if (!v.cityId) ctx.addIssue({ code: 'custom', path: ['cityId'], message: 'Elige la ciudad' });
      if (v.endKind === 'place' && !v.placeId) ctx.addIssue({ code: 'custom', path: ['placeId'], message: 'Elige el lugar' });
      return;
    }
    if (!v.decisions.length) ctx.addIssue({ code: 'custom', path: ['decisions'], message: 'Añade al menos una decisión' });
    v.decisions.forEach((d, i) => {
      if (!d.name) ctx.addIssue({ code: 'custom', path: ['decisions', i, 'name'], message: 'Ponle un nombre' });
      if (!d.description) ctx.addIssue({ code: 'custom', path: ['decisions', i, 'description'], message: 'Describe la decisión' });
    });
  });
export type ChapterFormValues = z.infer<typeof chapterFormSchema>;

export const blankFragment = (): ChapterFormValues['fragments'][number] => ({ text: '', animation: 'default' });
export const blankDecision = (): ChapterFormValues['decisions'][number] => ({ name: '', description: '', target: NEW_CHAPTER });

/** Un capítulo es final si no tiene decisiones que lleven a otros. */
export const isFinalChapter = (c: Chapter) => !c.decision?.options.length;

/**
 * Capítulo guardado → valores del formulario. Si aún no tiene lugar de finalización, se propone el lugar
 * donde vive el NPC (`home`).
 */
export function chapterToForm(chapter: Chapter, home: { cityId: string; placeId: string }): ChapterFormValues {
  const end = chapter.endLocation;
  const hasEnd = !!end?.cityId;
  return {
    name: chapter.name,
    fragments: chapter.story.length
      ? chapter.story.map((r) => ({ text: r.text, animation: asAnimation(r.animation) }))
      : [blankFragment()],
    isFinal: isFinalChapter(chapter),
    decisions:
      chapter.decision?.options.map((o) => ({ id: o.id, name: o.name, description: o.description, target: o.value })) ?? [],
    endKind: hasEnd ? (end?.placeId ? 'place' : 'city') : 'place',
    cityId: hasEnd ? end!.cityId! : home.cityId,
    placeId: hasEnd ? (end?.placeId ?? '') : home.placeId,
  };
}

/** Valores del formulario → cuerpo para la API. Los fragmentos vacíos se descartan. */
export function formToBody(v: ChapterFormValues): UpdateChapterInput {
  const story = v.fragments.map((f) => ({ text: f.text.trim(), animation: f.animation })).filter((f) => f.text);
  if (v.isFinal) {
    return {
      name: v.name,
      story,
      decision: null,
      endLocation: { endChapter: true, cityId: v.cityId, ...(v.endKind === 'place' ? { placeId: v.placeId } : {}) },
    };
  }
  return {
    name: v.name,
    story,
    endLocation: null,
    decision: {
      decisionType: 'choose',
      options: v.decisions.map((d) => ({
        ...(d.id ? { id: d.id } : {}),
        name: d.name.trim(),
        description: d.description.trim(),
        // sin destino, el server crea un capítulo nuevo y vacío con el nombre de la decisión
        ...(d.target !== NEW_CHAPTER ? { value: d.target } : {}),
      })),
    },
  };
}
