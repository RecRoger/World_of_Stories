import { useState } from 'react';
import { cn } from '@/lib/utils';
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
import './npc-form-dialog.scss';

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
      <DialogContent aria-describedby={undefined} className="npc-form">
        {/* Se monta al abrir, así cada apertura parte de los datos actuales */}
        {open && <NpcForm placeId={placeId} npc={npc} onSavingChange={setSaving} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

const subLabel = 'npc-form__sublabel';

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
  const hasOptions = decisionType !== 'item';
  const isMoney = decisionType === 'money';
  const canSave = !!name.trim() && !(isStory && hasOptions && options.some((o) => !o.name.trim()));

  const onTypeChange = (next: NpcType) => setValue('options', fitOptions(getValues('options'), next, getValues('decisionType')));
  const onDecisionTypeChange = (next: NpcFormValues['decisionType']) =>
    setValue('options', fitOptions(getValues('options'), getValues('npcType'), next));

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
    <form onSubmit={onSubmit} noValidate aria-busy={saving} className="npc-form__form">
      <DialogTitle>{npc ? 'Editar evento' : 'Nuevo evento'}</DialogTitle>

      {formError && (
        <p role="alert" className="npc-form__error">
          {formError}
        </p>
      )}

      <fieldset disabled={saving} className="npc-form__fields">
        <FormField id={id('name')} label="Nombre" error={errors.name?.message}>
          {(a11y) => <Input id={id('name')} autoComplete="off" className="npc-form__control" {...a11y} {...register('name')} />}
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
          {(a11y) => <Textarea id={id('description')} rows={3} className="npc-form__textarea" {...a11y} {...register('description')} />}
        </FormField>
        <FormField id={id('meeting')} label="Encuentro" error={errors.meeting?.message}>
          {(a11y) => <Textarea id={id('meeting')} rows={3} className="npc-form__textarea" {...a11y} {...register('meeting')} />}
        </FormField>
        <FormField id={id('rejected')} label="Rechazo" error={errors.rejected?.message}>
          {(a11y) => <Textarea id={id('rejected')} rows={3} className="npc-form__textarea" {...a11y} {...register('rejected')} />}
        </FormField>

        <div role="group" aria-labelledby={id('decision')} className="npc-form__group">
          <h3 id={id('decision')} className="npc-form__group-title">
            Decisión
          </h3>
          <FormField id={id('decision-type')} label="Tipo de decisión" hint={DECISION_HELP[decisionType]} labelClassName={subLabel}>
            {(a11y) => (
              <Select
                id={id('decision-type')}
                {...a11y}
                {...register('decisionType', { onChange: (e) => onDecisionTypeChange(e.target.value as NpcFormValues['decisionType']) })}
              >
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

          {hasOptions && (
            <div className="npc-form__options">
              {isStory && (
                <p className="npc-form__note">
                  Un NPC de tipo story tiene exactamente dos opciones: aceptar empieza la historia en su capítulo
                  inicial{npc ? '' : ' («Inicio», que se crea vacío con el evento)'} y rechazar muestra el texto de rechazo.
                  {isMoney && ' Aceptar cuesta el monto: si al lector no le alcanza, solo puede rechazar.'}
                </p>
              )}
              {errors.options?.message && <p className="npc-form__field-error">{errors.options.message}</p>}
              <ol className="npc-form__options">
                {fields.map((field, i) => (
                  <li key={field.id} className="npc-form__option">
                    <div className="npc-form__option-header">
                      <span className="npc-form__option-title">
                        {isStory ? (i === 0 ? 'Opción para aceptar' : 'Opción para rechazar') : `Opción ${i + 1}`}
                        {isMoney && (i === 0 ? ' · se paga' : ' · gratis')}
                      </span>
                      {!isStory && !isMoney && fields.length > 1 && (
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
                          className="npc-form__option-description"
                          {...a11y}
                          {...register(`options.${i}.description`)}
                        />
                      )}
                    </FormField>
                  </li>
                ))}
              </ol>
              {!isStory && !isMoney && fields.length < 10 && (
                <button
                  type="button"
                  className={cn(linkButtonClass, 'npc-form__add')}
                  onClick={() => append({ name: '', description: '' })}
                >
                  + Añadir opción
                </button>
              )}
            </div>
          )}
        </div>
      </fieldset>

      <div className="npc-form__actions">
        <Button type="submit" size="md" className="npc-form__submit" loading={saving} disabled={!canSave}>
          {saving ? 'Guardando' : 'Guardar evento'}
        </Button>
        <button type="button" className={linkButtonClass} disabled={saving} onClick={onDone}>
          Cancelar
        </button>
        <span role="status" className="visually-hidden">
          {saving ? 'Guardando el evento…' : ''}
        </span>
      </div>
    </form>
  );
}
