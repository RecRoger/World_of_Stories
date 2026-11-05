import { useState } from 'react';
import { useFieldArray, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { DECISION_TYPES, NPC_TYPES, type Npc, type NpcType } from '@wos/shared';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/form/form-field';
import { applyServerErrors } from '@/components/form/server-errors';
import { linkButtonClass } from '@/features/locations/inline-editor';
import { useCreateNpc, useUpdateNpc } from './api';
import { DECISION_HELP, emptyNpcForm, fitOptions, formToBody, npcFormSchema, npcToForm, type NpcFormValues } from './npc-form';

type NpcFormDialogProps = {
  placeId: string;
  /** Con `npc` edita ese evento; sin él, crea uno nuevo. */
  npc?: Npc;
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Modal "Nuevo evento" / "Editar evento": el NPC entero, con sus textos y su decisión. */
export function NpcFormDialog({ placeId, npc, open, onOpenChange }: NpcFormDialogProps) {
  const [saving, setSaving] = useState(false);
  // Mientras se guarda, el modal no se cierra (ni con Escape, ni con la X, ni pulsando fuera)
  const change = (next: boolean) => !saving && onOpenChange(next);

  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogContent aria-describedby={undefined} className="px-[clamp(24px,6vw,52px)] pt-12 pb-11">
        {/* Se monta al abrir, así cada apertura parte de los datos actuales */}
        {open && <NpcForm placeId={placeId} npc={npc} onSavingChange={setSaving} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

const subLabel = 'font-serif text-[17px] font-normal';

function NpcForm({
  placeId,
  npc,
  onSavingChange,
  onDone,
}: {
  placeId: string;
  npc?: Npc;
  onSavingChange: (saving: boolean) => void;
  onDone: () => void;
}) {
  const create = useCreateNpc(placeId);
  const update = useUpdateNpc(placeId);
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, control, watch, setValue, getValues, setError, formState } = useForm<NpcFormValues>({
    resolver: zodResolver(npcFormSchema),
    defaultValues: npc ? npcToForm(npc) : emptyNpcForm(),
  });
  const { fields, append, remove } = useFieldArray({ control, name: 'options' });
  const { errors, isSubmitting: saving } = formState;
  const [name, npcType, decisionType, options] = watch(['name', 'npcType', 'decisionType', 'options']);
  const isStory = npcType === 'story';
  const id = (field: string) => `npc-${field}`;
  // Como en el diseño: hace falta el nombre, y en una historia las dos opciones con nombre
  const canSave = !!name.trim() && !(isStory && decisionType === 'choose' && options.some((o) => !o.name.trim()));

  const onTypeChange = (next: NpcType) => setValue('options', fitOptions(getValues('options'), next));

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    onSavingChange(true);
    try {
      const body = formToBody(values);
      if (npc) await update.mutateAsync({ id: npc.id, body });
      else await create.mutateAsync(body);
      onSavingChange(false);
      onDone();
    } catch (err) {
      onSavingChange(false);
      setFormError(applyServerErrors(err, setError, ['name']));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={saving} className="flex flex-col gap-7">
      <DialogTitle>{npc ? 'Editar evento' : 'Nuevo evento'}</DialogTitle>

      {formError && (
        <p role="alert" className="bg-danger/8 px-3.5 py-2.5 text-[17px] text-danger">
          {formError}
        </p>
      )}

      <fieldset disabled={saving} className="m-0 flex min-w-0 flex-col gap-7 border-0 p-0">
        <FormField id={id('name')} label="Nombre" error={errors.name?.message}>
          {(a11y) => <Input id={id('name')} autoComplete="off" className="min-h-13 text-xl" {...a11y} {...register('name')} />}
        </FormField>
        <FormField id={id('type')} label="Tipo de NPC">
          {(a11y) => (
            <Select id={id('type')} {...a11y} {...register('npcType', { onChange: (e) => onTypeChange(e.target.value as NpcType) })}>
              {NPC_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          )}
        </FormField>
        <FormField id={id('description')} label="Descripción" error={errors.description?.message}>
          {(a11y) => <Textarea id={id('description')} rows={3} className="min-h-24" {...a11y} {...register('description')} />}
        </FormField>
        <FormField id={id('meeting')} label="Encuentro" error={errors.meeting?.message}>
          {(a11y) => <Textarea id={id('meeting')} rows={3} className="min-h-24" {...a11y} {...register('meeting')} />}
        </FormField>
        <FormField id={id('rejected')} label="Rechazo" error={errors.rejected?.message}>
          {(a11y) => <Textarea id={id('rejected')} rows={3} className="min-h-24" {...a11y} {...register('rejected')} />}
        </FormField>

        <div role="group" aria-labelledby={id('decision')} className="flex min-w-0 flex-col gap-5 border-t border-ink pt-6">
          <h3 id={id('decision')} className="font-display text-[32px] leading-none font-semibold">
            Decisión
          </h3>
          <FormField id={id('decision-type')} label="Tipo de decisión" hint={DECISION_HELP[decisionType]} labelClassName={subLabel}>
            {(a11y) => (
              <Select id={id('decision-type')} {...a11y} {...register('decisionType')}>
                {DECISION_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </Select>
            )}
          </FormField>

          {decisionType === 'money' && (
            <FormField id={id('amount')} label="Monto del dinero solicitado" error={errors.amount?.message} labelClassName={subLabel}>
              {(a11y) => <Input id={id('amount')} type="number" min={0} step={1} inputMode="numeric" {...a11y} {...register('amount')} />}
            </FormField>
          )}
          {decisionType === 'item' && (
            <FormField id={id('item')} label="Ítem a pedir" error={errors.item?.message} labelClassName={subLabel}>
              {(a11y) => <Input id={id('item')} autoComplete="off" {...a11y} {...register('item')} />}
            </FormField>
          )}

          {decisionType === 'choose' && (
            <div className="flex flex-col gap-5">
              {isStory && (
                <p className="text-[17px] text-ink-muted">
                  Un NPC de tipo story tiene exactamente dos opciones: una para aceptar y otra para rechazar.
                </p>
              )}
              {errors.options?.message && <p className="text-base text-danger">{errors.options.message}</p>}
              <ol className="flex flex-col gap-5">
                {fields.map((field, i) => (
                  <li key={field.id} className="flex flex-col gap-3 border border-paper-line bg-parchment/60 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-display text-xl font-bold">
                        {isStory ? (i === 0 ? 'Opción para aceptar' : 'Opción para rechazar') : `Opción ${i + 1}`}
                      </span>
                      {!isStory && fields.length > 1 && (
                        <button type="button" className={linkButtonClass} onClick={() => remove(i)}>
                          Quitar
                        </button>
                      )}
                    </div>
                    <FormField id={id(`option-${i}-name`)} label="Nombre" error={errors.options?.[i]?.name?.message} labelClassName={subLabel}>
                      {(a11y) => <Input id={id(`option-${i}-name`)} autoComplete="off" {...a11y} {...register(`options.${i}.name`)} />}
                    </FormField>
                    <FormField
                      id={id(`option-${i}-description`)}
                      label="Descripción"
                      error={errors.options?.[i]?.description?.message}
                      labelClassName={subLabel}
                    >
                      {(a11y) => (
                        <Textarea
                          id={id(`option-${i}-description`)}
                          rows={2}
                          className="min-h-20 bg-paper"
                          {...a11y}
                          {...register(`options.${i}.description`)}
                        />
                      )}
                    </FormField>
                  </li>
                ))}
              </ol>
              {!isStory && fields.length < 10 && (
                <button
                  type="button"
                  className={`${linkButtonClass} self-start px-1 text-lg`}
                  onClick={() => append({ name: '', description: '' })}
                >
                  + Añadir opción
                </button>
              )}
            </div>
          )}
        </div>
      </fieldset>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-ink pt-7">
        <Button type="submit" size="md" className="min-h-13 px-9 text-xl" loading={saving} disabled={!canSave}>
          {saving ? 'Guardando' : 'Guardar evento'}
        </Button>
        <button type="button" className={linkButtonClass} disabled={saving} onClick={onDone}>
          Cancelar
        </button>
        <span role="status" className="sr-only">
          {saving ? 'Guardando el evento…' : ''}
        </span>
      </div>
    </form>
  );
}
