import { z } from 'zod';
import { DECISION_TYPES, NPC_TYPES, STORY_OPTIONS, type CreateNpcInput, type Npc, type NpcType } from '@wos/shared';
import { taleToText, textToTale } from '@/features/locations/narrative';

/** Ayuda de cada tipo de decisión (como en el diseño). */
export const DECISION_HELP: Record<(typeof DECISION_TYPES)[number], string> = {
  choose: 'choose · el jugador elige entre opciones',
  item: 'item · se solicita un ítem',
  money: 'money · se solicita dinero',
};

const text = z.string().trim().min(1, 'Escribe al menos un párrafo');

/*
 * Valores del formulario del NPC. Los textos (descripción, encuentro, rechazo) van como texto corrido con la
 * animación "Normal", igual que los extractos de ciudades y lugares. Las opciones solo se validan si la decisión
 * es de elegir: con dinero o ítem no se muestran ni se envían.
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
    options: z.array(z.object({ id: z.string().optional(), name: z.string(), description: z.string() })),
  })
  .superRefine((v, ctx) => {
    if (v.decisionType === 'money' && !/^\d+$/.test(v.amount.trim())) {
      ctx.addIssue({ code: 'custom', path: ['amount'], message: 'Indica un monto (número entero)' });
    }
    if (v.decisionType === 'item' && !v.item.trim()) {
      ctx.addIssue({ code: 'custom', path: ['item'], message: 'Indica el ítem que se pide' });
    }
    if (v.decisionType !== 'choose') return;
    if (!v.options.length) ctx.addIssue({ code: 'custom', path: ['options'], message: 'Añade al menos una opción' });
    v.options.forEach((o, i) => {
      if (!o.name.trim()) ctx.addIssue({ code: 'custom', path: ['options', i, 'name'], message: 'Ponle un nombre' });
      if (!o.description.trim()) ctx.addIssue({ code: 'custom', path: ['options', i, 'description'], message: 'Describe la opción' });
    });
  });
export type NpcFormValues = z.infer<typeof npcFormSchema>;

const blankOption = () => ({ name: '', description: '' });

/** Opciones según el tipo: un NPC de historia tiene exactamente dos (aceptar y rechazar); el resto, al menos una. */
export function fitOptions(options: NpcFormValues['options'], npcType: NpcType) {
  if (npcType === 'story') {
    const two = options.slice(0, STORY_OPTIONS);
    while (two.length < STORY_OPTIONS) two.push(blankOption());
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
    item: d?.item ?? '',
    options: fitOptions(d?.options.map((o) => ({ id: o.id, name: o.name, description: o.description })) ?? [], npcType),
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
      ...(v.decisionType === 'item' ? { item: v.item.trim() } : {}),
      options:
        v.decisionType === 'choose'
          ? v.options.map((o) => ({ ...(o.id ? { id: o.id } : {}), name: o.name.trim(), description: o.description.trim() }))
          : [],
    },
  };
}
