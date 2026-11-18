import { z } from 'zod';
import { DECISION_TYPES, ITEM_OPTIONS, MONEY_OPTIONS, NPC_TYPES, STORY_OPTIONS, type CreateNpcInput, type Npc, type NpcType } from '@wos/shared';
import { taleToText, textToTale } from '@/features/locations/narrative';

/** Ayuda de cada tipo de decisión (como en el diseño). */
export const DECISION_HELP: Record<(typeof DECISION_TYPES)[number], string> = {
  choose: 'choose · el jugador elige entre opciones',
  item: 'item · la primera opción usa un objeto del catálogo (en una historia, aceptar lo pide)',
  money: 'money · la primera opción cuesta dinero (en una historia, aceptar se paga)',
};

const text = z.string().trim().min(1, 'Escribe al menos un párrafo');

/*
 * Valores del formulario del NPC. Los textos (descripción, encuentro, rechazo) van como texto corrido con la
 * animación "Normal", igual que los extractos de ciudades y lugares. Las opciones se validan si la decisión es de
 * elegir o de dinero (la primera se paga y la segunda no); con ítem no se muestran ni se envían.
 */
export const npcFormSchema = z
  .object({
    name: z.string().trim().min(1, 'El nombre es obligatorio').max(80),
    npcType: z.enum(NPC_TYPES),
    description: text,
    meeting: text,
    rejected: text,
    decisionType: z.enum(DECISION_TYPES),
    amount: z.string(),
    item: z.string(),
    /** Con `item`: el objeto se quita del inventario al usarlo */
    removeItem: z.boolean(),
    options: z.array(z.object({ id: z.string().optional(), name: z.string(), description: z.string() })),
  })
  .superRefine((v, ctx) => {
    if (v.decisionType === 'money' && !(/^\d+$/.test(v.amount.trim()) && Number(v.amount) > 0)) {
      ctx.addIssue({ code: 'custom', path: ['amount'], message: 'Indica un monto (número entero mayor que 0)' });
    }
    if (v.decisionType === 'item' && !v.item) {
      ctx.addIssue({ code: 'custom', path: ['item'], message: 'Elige el objeto que se pide' });
    }
    if (!v.options.length) ctx.addIssue({ code: 'custom', path: ['options'], message: 'Añade al menos una opción' });
    v.options.forEach((o, i) => {
      if (!o.name.trim()) ctx.addIssue({ code: 'custom', path: ['options', i, 'name'], message: 'Ponle un nombre' });
      if (!o.description.trim()) ctx.addIssue({ code: 'custom', path: ['options', i, 'description'], message: 'Describe la opción' });
    });
  });
export type NpcFormValues = z.infer<typeof npcFormSchema>;

const blankOption = () => ({ name: '', description: '' });

/**
 * Opciones según el tipo: un NPC de historia tiene exactamente dos (aceptar y rechazar), igual que una decisión de
 * dinero (pagar y no pagar) o de objeto (usarlo y no usarlo); el resto, al menos una.
 */
export function fitOptions(options: NpcFormValues['options'], npcType: NpcType, decisionType?: NpcFormValues['decisionType']) {
  if (npcType === 'story' || decisionType === 'money' || decisionType === 'item') {
    const count = npcType === 'story' ? STORY_OPTIONS : decisionType === 'item' ? ITEM_OPTIONS : MONEY_OPTIONS;
    const two = options.slice(0, count);
    while (two.length < count) two.push(blankOption());
    return two;
  }
  return options.length ? options : [blankOption()];
}

export const emptyNpcForm = (): NpcFormValues => ({
  name: '',
  npcType: 'story',
  description: '',
  meeting: '',
  rejected: '',
  decisionType: 'choose',
  amount: '',
  item: '',
  removeItem: false,
  options: fitOptions([], 'story'),
});

const asNpcType = (t: string): NpcType => ((NPC_TYPES as readonly string[]).includes(t) ? (t as NpcType) : 'story');
const asDecisionType = (t: string | null | undefined) =>
  (DECISION_TYPES as readonly string[]).includes(t ?? '') ? (t as NpcFormValues['decisionType']) : 'choose';

/** NPC guardado → valores del formulario de edición. */
export function npcToForm(npc: Npc): NpcFormValues {
  const npcType = asNpcType(npc.npcType);
  const d = npc.decision;
  return {
    name: npc.name,
    npcType,
    description: taleToText(npc.description?.tale ?? []),
    meeting: taleToText(npc.meeting?.tale ?? []),
    rejected: taleToText(npc.rejected?.tale ?? []),
    decisionType: asDecisionType(d?.decisionType),
    amount: d?.amount != null ? String(d.amount) : '',
    item: d?.decisionType === 'item' ? (d.item ?? '') : '',
    removeItem: d?.decisionType === 'item' && !!d.options[0]?.removeItem,
    options: fitOptions(
      d?.options.map((o) => ({ id: o.id, name: o.name, description: o.description })) ?? [],
      npcType,
      asDecisionType(d?.decisionType),
    ),
  };
}

/** Valores del formulario → cuerpo para la API (crear o editar). */
export function formToBody(v: NpcFormValues): CreateNpcInput {
  return {
    name: v.name,
    npcType: v.npcType,
    description: textToTale(v.description),
    meeting: textToTale(v.meeting),
    rejected: textToTale(v.rejected),
    decision: {
      decisionType: v.decisionType,
      ...(v.decisionType === 'money' ? { amount: Number(v.amount) } : {}),
      ...(v.decisionType === 'item' ? { item: v.item } : {}),
      options: v.options.map((o, i) => ({
        ...(o.id ? { id: o.id } : {}),
        name: o.name.trim(),
        description: o.description.trim(),
        // la primera opción de una decisión de objeto es la que lo usa: se gasta si así se marcó
        ...(v.decisionType === 'item' && i === 0 ? { removeItem: v.removeItem } : {}),
      })),
    },
  };
}
