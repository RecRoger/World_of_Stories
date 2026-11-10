import { useState } from 'react';
import { useFieldArray, useForm, type UseFormRegister } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ANIMATIONS, type Chapter } from '@wos/shared';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { FormField } from '@/components/form/form-field';
import { applyServerErrors } from '@/components/form/server-errors';
import { useCities } from '@/features/cities/api';
import { useCityPlaces } from '@/features/places/api';
import { linkButtonClass } from '@/features/locations/inline-editor';
import { cn } from '@/lib/utils';
import { useUpdateChapter } from './api';
import { ANIMATION_LABELS, FragmentPreview } from './animations';
import {
  blankDecision,
  blankFragment,
  chapterFormSchema,
  chapterToForm,
  formToBody,
  NEW_CHAPTER,
  type ChapterFormValues,
} from './chapter-form';

type ChapterFormDialogProps = {
  npcId: string;
  chapter: Chapter;
  /** Todos los capítulos del NPC, para elegir a cuál lleva cada decisión. */
  chapters: Chapter[];
  /** Ciudad y lugar del NPC: el lugar de finalización que se propone por defecto. */
  home: { cityId: string; placeId: string };
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

/** Modal "Editar capítulo": nombre, fragmentos con su animación, y decisiones o lugar de finalización. */
export function ChapterFormDialog({ open, onOpenChange, ...props }: ChapterFormDialogProps) {
  const [saving, setSaving] = useState(false);
  // Mientras se guarda, el modal no se cierra (ni con Escape, ni con la X, ni pulsando fuera)
  const change = (next: boolean) => !saving && onOpenChange(next);

  return (
    <Dialog open={open} onOpenChange={change}>
      <DialogContent aria-describedby={undefined} className="w-[min(100%,1120px)] px-[clamp(24px,6vw,52px)] pt-12 pb-11">
        {/* Se monta al abrir, así cada apertura parte de los datos actuales */}
        {open && <ChapterForm {...props} onSavingChange={setSaving} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

const groupClass = 'flex min-w-0 flex-col gap-4 border-t border-ink pt-7';
const groupTitle = 'font-display text-[32px] leading-none font-semibold';
const subLabel = 'font-serif text-[17px] font-normal';
const itemClass = 'flex flex-col gap-2.5 border border-paper-line bg-parchment px-5 pt-4 pb-5';
const itemField = 'bg-paper';

function ChapterForm({
  npcId,
  chapter,
  chapters,
  home,
  onSavingChange,
  onDone,
}: Omit<ChapterFormDialogProps, 'open' | 'onOpenChange'> & { onSavingChange: (saving: boolean) => void; onDone: () => void }) {
  const update = useUpdateChapter(npcId);
  const [formError, setFormError] = useState<string | null>(null);
  // Contador de reproducciones de la vista previa de cada fragmento
  const [plays, setPlays] = useState<Record<string, number>>({});
  const targets = chapters.filter((c) => c.id !== chapter.id);
  const defaults = chapterToForm(chapter, home);
  // Una decisión que apunte a un capítulo que ya no existe se trata como "capítulo nuevo"
  defaults.decisions = defaults.decisions.map((d) => (targets.some((c) => c.id === d.target) ? d : { ...d, target: NEW_CHAPTER }));

  const { register, handleSubmit, control, watch, setValue, setError, formState } = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterFormSchema),
    defaultValues: defaults,
  });
  const fragments = useFieldArray({ control, name: 'fragments' });
  const decisions = useFieldArray({ control, name: 'decisions' });
  const { errors, isSubmitting: saving } = formState;
  const [name, isFinal, endKind, cityId, values] = watch(['name', 'isFinal', 'endKind', 'cityId', 'fragments']);
  const id = (field: string) => `chapter-${field}`;
  const play = (key: string) => setPlays((p) => ({ ...p, [key]: (p[key] ?? 0) + 1 }));

  const onSubmit = handleSubmit(async (v) => {
    setFormError(null);
    onSavingChange(true);
    try {
      await update.mutateAsync({ id: chapter.id, body: formToBody(v) });
      onSavingChange(false);
      onDone();
    } catch (err) {
      onSavingChange(false);
      setFormError(applyServerErrors(err, setError, ['name']));
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate aria-busy={saving} className="flex flex-col gap-7">
      <DialogTitle>Editar capítulo</DialogTitle>

      {formError && (
        <p role="alert" className="bg-danger/8 px-3.5 py-2.5 text-[17px] text-danger">
          {formError}
        </p>
      )}

      <fieldset disabled={saving} className="m-0 flex min-w-0 flex-col gap-7 border-0 p-0">
        <FormField id={id('name')} label="Nombre del capítulo" error={errors.name?.message}>
          {(a11y) => <Input id={id('name')} autoComplete="off" className="min-h-13 text-xl" {...a11y} {...register('name')} />}
        </FormField>

        <div role="group" aria-labelledby={id('fragments')} className={groupClass}>
          <h3 id={id('fragments')} className={groupTitle}>
            Fragmentos
          </h3>
          <ol className="flex flex-col gap-4">
            {fragments.fields.map((field, i) => (
              <li key={field.id} className={itemClass}>
                <div className="flex items-center justify-between gap-3">
                  <span className="text-[17px] text-ink-muted">Fragmento {i + 1}</span>
                  {fragments.fields.length > 1 && (
                    <button type="button" className={linkButtonClass} onClick={() => fragments.remove(i)}>
                      Quitar
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-[repeat(auto-fit,minmax(min(300px,100%),1fr))] items-stretch gap-6">
                  <div className="flex flex-col gap-2.5">
                    <FormField id={id(`fragment-${i}-text`)} label="Texto" labelClassName={subLabel}>
                      {(a11y) => (
                        <Textarea
                          id={id(`fragment-${i}-text`)}
                          rows={3}
                          className={cn('min-h-24', itemField)}
                          {...a11y}
                          {...register(`fragments.${i}.text`)}
                        />
                      )}
                    </FormField>
                    <FormField id={id(`fragment-${i}-animation`)} label="Tipo de animación" labelClassName={subLabel}>
                      {(a11y) => (
                        <Select
                          id={id(`fragment-${i}-animation`)}
                          className={itemField}
                          {...a11y}
                          // al cambiar de animación, se reproduce para verla
                          {...register(`fragments.${i}.animation`, { onChange: () => play(field.id) })}
                        >
                          {ANIMATIONS.map((a) => (
                            <option key={a} value={a}>
                              {ANIMATION_LABELS[a]}
                            </option>
                          ))}
                        </Select>
                      )}
                    </FormField>
                  </div>
                  <div className="flex flex-col gap-2.5">
                    <div className="flex min-h-7 items-center justify-between gap-3">
                      <span className="text-[17px]">Vista previa</span>
                      <button
                        type="button"
                        className={cn(linkButtonClass, 'min-h-8')}
                        aria-label={`Reproducir animación del fragmento ${i + 1}`}
                        onClick={() => play(field.id)}
                      >
                        ▶ Reproducir
                      </button>
                    </div>
                    <FragmentPreview
                      text={values[i]?.text ?? ''}
                      animation={values[i]?.animation ?? 'default'}
                      play={plays[field.id] ?? 0}
                    />
                  </div>
                </div>
              </li>
            ))}
          </ol>
          <button type="button" className={cn(linkButtonClass, 'self-start px-0 text-lg')} onClick={() => fragments.append(blankFragment())}>
            + Añadir fragmento
          </button>
        </div>

        <div role="group" aria-labelledby={id('final')} className={groupClass}>
          <h3 id={id('final')} className={groupTitle}>
            ¿Es un capítulo final?
          </h3>
          <div className="flex flex-wrap gap-3">
            <ToggleButton pressed={isFinal} onClick={() => setValue('isFinal', true)}>
              Sí, termina en un lugar
            </ToggleButton>
            <ToggleButton pressed={!isFinal} onClick={() => setValue('isFinal', false)}>
              No, continúa con decisiones
            </ToggleButton>
          </div>
        </div>

        {!isFinal && (
          <div role="group" aria-labelledby={id('decisions')} className={groupClass}>
            <div className="flex flex-col gap-1">
              <h3 id={id('decisions')} className={groupTitle}>
                Decisiones
              </h3>
              <p className="text-[17px] text-ink-muted">
                Opciones hacia otros capítulos. Cada una lleva a un capítulo que ya existe o a uno nuevo, que se crea vacío
                y con el nombre de la decisión al guardar.
              </p>
            </div>
            {errors.decisions?.message && <p className="text-base text-danger">{errors.decisions.message}</p>}
            <ol className="flex flex-col gap-4">
              {decisions.fields.map((field, i) => (
                <li key={field.id} className={itemClass}>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-[17px] text-ink-muted">Decisión {i + 1}</span>
                    <button type="button" className={linkButtonClass} onClick={() => decisions.remove(i)}>
                      Quitar
                    </button>
                  </div>
                  <FormField id={id(`decision-${i}-name`)} label="Nombre" error={errors.decisions?.[i]?.name?.message} labelClassName={subLabel}>
                    {(a11y) => (
                      <Input id={id(`decision-${i}-name`)} autoComplete="off" className={itemField} {...a11y} {...register(`decisions.${i}.name`)} />
                    )}
                  </FormField>
                  <FormField
                    id={id(`decision-${i}-description`)}
                    label="Descripción"
                    error={errors.decisions?.[i]?.description?.message}
                    labelClassName={subLabel}
                  >
                    {(a11y) => (
                      <Textarea
                        id={id(`decision-${i}-description`)}
                        rows={2}
                        className={cn('min-h-20', itemField)}
                        {...a11y}
                        {...register(`decisions.${i}.description`)}
                      />
                    )}
                  </FormField>
                  <FormField id={id(`decision-${i}-target`)} label="Capítulo al que lleva" labelClassName={subLabel}>
                    {(a11y) => (
                      <Select id={id(`decision-${i}-target`)} className={itemField} {...a11y} {...register(`decisions.${i}.target`)}>
                        <option value={NEW_CHAPTER}>+ Crear un capítulo nuevo</option>
                        {targets.map((c) => (
                          <option key={c.id} value={c.id}>
                            {c.name}
                            {c.id === chapters[0]?.id ? ' (inicio)' : ''}
                          </option>
                        ))}
                      </Select>
                    )}
                  </FormField>
                </li>
              ))}
            </ol>
            {decisions.fields.length < 10 && (
              <button type="button" className={cn(linkButtonClass, 'self-start px-0 text-lg')} onClick={() => decisions.append(blankDecision())}>
                + Añadir decisión
              </button>
            )}
          </div>
        )}

        {isFinal && (
          <div role="group" aria-labelledby={id('end')} className={groupClass}>
            <div className="flex flex-col gap-1">
              <h3 id={id('end')} className={groupTitle}>
                Lugar de finalización
              </h3>
              <p className="text-[17px] text-ink-muted">La historia termina aquí, en una ciudad o un lugar.</p>
            </div>
            <FormField id={id('end-kind')} label="Apunta a" labelClassName={cn(subLabel, 'text-ink-muted')}>
              {(a11y) => (
                <Select id={id('end-kind')} className="min-h-13 text-xl" {...a11y} {...register('endKind')}>
                  <option value="city">Ciudad</option>
                  <option value="place">Lugar</option>
                </Select>
              )}
            </FormField>
            <CitySelect id={id('end-city')} register={register} error={errors.cityId?.message} onChange={() => setValue('placeId', '')} />
            {endKind === 'place' && cityId && (
              <PlaceSelect id={id('end-place')} cityId={cityId} register={register} error={errors.placeId?.message} />
            )}
          </div>
        )}
      </fieldset>

      <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-ink pt-7">
        <Button type="submit" size="md" className="min-h-13 px-9 text-xl" loading={saving} disabled={!name.trim()}>
          {saving ? 'Guardando' : 'Guardar capítulo'}
        </Button>
        <button type="button" className={linkButtonClass} disabled={saving} onClick={onDone}>
          Cancelar
        </button>
        <span role="status" className="sr-only">
          {saving ? 'Guardando el capítulo…' : ''}
        </span>
      </div>
    </form>
  );
}

function ToggleButton({ pressed, onClick, children }: { pressed: boolean; onClick: () => void; children: string }) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      onClick={onClick}
      className={cn(
        'min-h-12 cursor-pointer rounded-[2px] border border-ink px-6 font-serif text-[19px] disabled:cursor-default',
        pressed ? 'bg-ink text-parchment' : 'bg-parchment text-ink hover:bg-paper-edge',
      )}
    >
      {children}
    </button>
  );
}

type RegisterProp = { id: string; register: UseFormRegister<ChapterFormValues>; error?: string };

function CitySelect({ id, register, error, onChange }: RegisterProp & { onChange: () => void }) {
  const { data: cities, isPending } = useCities();
  return (
    <FormField id={id} label="Ciudad" error={error} labelClassName={cn(subLabel, 'text-ink-muted')}>
      {/* Hasta tener las opciones no se registra el campo: así el select muestra el valor guardado al montarse */}
      {(a11y) =>
        isPending ? (
          <LoadingSelect id={id} label="Cargando ciudades…" />
        ) : (
        <Select id={id} className="min-h-13 text-xl" {...a11y} {...register('cityId', { onChange })}>
          <option value="">Elige una ciudad</option>
          {cities?.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </Select>
        )
      }
    </FormField>
  );
}

function LoadingSelect({ id, label }: { id: string; label: string }) {
  return (
    <Select id={id} className="min-h-13 text-xl" disabled>
      <option>{label}</option>
    </Select>
  );
}

function PlaceSelect({ id, cityId, register, error }: RegisterProp & { cityId: string }) {
  const { data: places, isPending } = useCityPlaces(cityId);
  return (
    <FormField id={id} label="Lugar" error={error} labelClassName={cn(subLabel, 'text-ink-muted')}>
      {(a11y) =>
        isPending ? (
          <LoadingSelect id={id} label="Cargando lugares…" />
        ) : (
        <Select id={id} className="min-h-13 text-xl" {...a11y} {...register('placeId')}>
          <option value="">{places?.length ? 'Elige un lugar' : 'Esta ciudad no tiene lugares'}</option>
          {places?.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </Select>
        )
      }
    </FormField>
  );
}
