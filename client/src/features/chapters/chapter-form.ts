import { z } from 'zod';
import { ANIMATIONS, MONEY_OPTIONS, type Chapter, type UpdateChapterInput } from '@wos/shared';
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
    /** `money`: la primera decisión cuesta `amount` monedas y la segunda es gratis (siempre dos) */
    decisionType: z.enum(['choose', 'money']),
    amount: z.string(),
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
    /** Lo que gana el personaje al terminar de leerlo: nada, dinero u objetos (por nombre) */
    rewardType: z.enum(['none', 'money', 'item']),
    rewardAmount: z.string(),
    rewardItems: z.array(z.object({ name: z.string().trim().max(80, 'Máximo 80 caracteres') })),
  })
  .superRefine((v, ctx) => {
    if (v.rewardType === 'money' && !(/^\d+$/.test(v.rewardAmount.trim()) && Number(v.rewardAmount) > 0)) {
      ctx.addIssue({ code: 'custom', path: ['rewardAmount'], message: 'Indica cuántas monedas gana (un número entero mayor que 0)' });
    }
    if (v.rewardType === 'item' && !v.rewardItems.some((i) => i.name.trim())) {
      ctx.addIssue({ code: 'custom', path: ['rewardItems'], message: 'Escribe al menos un objeto' });
    }
    if (v.isFinal) {
      if (!v.cityId) ctx.addIssue({ code: 'custom', path: ['cityId'], message: 'Elige la ciudad' });
      if (v.endKind === 'place' && !v.placeId) ctx.addIssue({ code: 'custom', path: ['placeId'], message: 'Elige el lugar' });
      return;
    }
    if (!v.decisions.length) ctx.addIssue({ code: 'custom', path: ['decisions'], message: 'Añade al menos una decisión' });
    if (v.decisionType === 'money') {
      if (!/^\d+$/.test(v.amount.trim()) || Number(v.amount) < 1) {
        ctx.addIssue({ code: 'custom', path: ['amount'], message: 'Indica cuántas monedas cuesta (un número entero mayor que 0)' });
      }
      if (v.decisions.length !== MONEY_OPTIONS) {
        ctx.addIssue({ code: 'custom', path: ['decisions'], message: 'Una decisión de dinero tiene exactamente dos opciones' });
      }
    }
    v.decisions.forEach((d, i) => {
      if (!d.name) ctx.addIssue({ code: 'custom', path: ['decisions', i, 'name'], message: 'Ponle un nombre' });
      if (!d.description) ctx.addIssue({ code: 'custom', path: ['decisions', i, 'description'], message: 'Describe la decisión' });
    });
  });
export type ChapterFormValues = z.infer<typeof chapterFormSchema>;

export const blankFragment = (): ChapterFormValues['fragments'][number] => ({ text: '', animation: 'default' });
export const blankDecision = (): ChapterFormValues['decisions'][number] => ({ name: '', description: '', target: NEW_CHAPTER });

/** Una decisión de dinero tiene exactamente dos opciones: se recortan o se completan con opciones en blanco */
export function fitMoneyDecisions(decisions: ChapterFormValues['decisions']) {
  const two = decisions.slice(0, MONEY_OPTIONS);
  while (two.length < MONEY_OPTIONS) two.push(blankDecision());
  return two;
}

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
    decisionType: chapter.decision?.decisionType === 'money' ? 'money' : 'choose',
    amount: chapter.decision?.amount ? String(chapter.decision.amount) : '',
    decisions:
      chapter.decision?.options.map((o) => ({ id: o.id, name: o.name, description: o.description, target: o.value })) ?? [],
    endKind: hasEnd ? (end?.placeId ? 'place' : 'city') : 'place',
    cityId: hasEnd ? end!.cityId! : home.cityId,
    placeId: hasEnd ? (end?.placeId ?? '') : home.placeId,
    ...rewardToForm(chapter.reward),
  };
}

const asRewardType = (t: string | undefined): ChapterFormValues['rewardType'] => (t === 'money' || t === 'item' ? t : 'none');

function rewardToForm(reward: Chapter['reward']) {
  const items = reward?.type === 'item' ? (reward.items ?? []) : [];
  return {
    rewardType: asRewardType(reward?.type),
    rewardAmount: reward?.type === 'money' && reward.amount ? String(reward.amount) : '',
    rewardItems: (items.length ? items : ['']).map((name) => ({ name })),
  };
}

/** La recompensa para la API (`null` la quita); los objetos vacíos se descartan */
function rewardToBody(v: ChapterFormValues): UpdateChapterInput['reward'] {
  if (v.rewardType === 'money') return { type: 'money', amount: Number(v.rewardAmount) };
  if (v.rewardType === 'item') return { type: 'item', items: v.rewardItems.map((i) => i.name.trim()).filter(Boolean) };
  return null;
}

/** Valores del formulario → cuerpo para la API. Los fragmentos vacíos se descartan. */
export function formToBody(v: ChapterFormValues): UpdateChapterInput {
  const story = v.fragments.map((f) => ({ text: f.text.trim(), animation: f.animation })).filter((f) => f.text);
  if (v.isFinal) {
    return {
      name: v.name,
      story,
      reward: rewardToBody(v),
      decision: null,
      endLocation: { endChapter: true, cityId: v.cityId, ...(v.endKind === 'place' ? { placeId: v.placeId } : {}) },
    };
  }
  return {
    name: v.name,
    story,
    reward: rewardToBody(v),
    endLocation: null,
    decision: {
      decisionType: v.decisionType,
      ...(v.decisionType === 'money' ? { amount: Number(v.amount) } : {}),
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
