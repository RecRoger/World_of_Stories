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
import { useItems } from '@/features/items/api';
import { ItemSelect } from '@/features/items/item-select';
import { useCityPlaces } from '@/features/places/api';
import { linkButtonClass } from '@/features/locations/inline-editor';
import { formatMoney } from '@/lib/format';
import { cn } from '@/lib/utils';
import { useUpdateChapter } from './api';
import { ANIMATION_LABELS, FragmentPreview } from './animations';
import {
  blankDecision,
  blankFragment,
  chapterFormSchema,
  chapterToForm,
  fitMoneyDecisions,
  formToBody,
  NEW_CHAPTER,
  type ChapterFormValues,
} from './chapter-form';
import './chapter-form-dialog.scss';

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
      <DialogContent aria-describedby={undefined} className="chapter-form">
        {/* Se monta al abrir, así cada apertura parte de los datos actuales */}
        {open && <ChapterForm {...props} onSavingChange={setSaving} onDone={() => onOpenChange(false)} />}
      </DialogContent>
    </Dialog>
  );
}

const groupClass = 'chapter-form__group';
const groupTitle = 'chapter-form__group-title';
const subLabel = 'chapter-form__sublabel';
const itemClass = 'chapter-form__item';
const itemField = 'chapter-form__item-field';

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

  const { register, handleSubmit, control, watch, setValue, getValues, setError, formState } = useForm<ChapterFormValues>({
    resolver: zodResolver(chapterFormSchema),
    defaultValues: defaults,
  });
  const fragments = useFieldArray({ control, name: 'fragments' });
  const decisions = useFieldArray({ control, name: 'decisions' });
  const rewardItems = useFieldArray({ control, name: 'rewardItems' });
  // Catálogo de objetos: para mostrar los nombres de la recompensa y de la decisión de objeto
  const { data: catalog } = useItems();
  const itemById = (itemId: string) => catalog?.find((i) => i.id === itemId);
  // Objeto elegido en el selector, antes de añadirlo a la recompensa
  const [pick, setPick] = useState('');
  const { errors, isSubmitting: saving } = formState;
  const [rewardType, rewardList, decisionItem] = watch(['rewardType', 'rewardItems', 'item']);
  const addRewardItem = () => {
    if (!pick) return;
    rewardItems.append({ itemId: pick, quantity: '1' });
    setPick('');
  };
  const [name, isFinal, endKind, cityId, values, decisionType, amount] = watch([
    'name',
    'isFinal',
    'endKind',
    'cityId',
    'fragments',
    'decisionType',
    'amount',
  ]);
  const isMoney = decisionType === 'money';
  const isItem = decisionType === 'item';
  // Dinero y objeto: siempre dos decisiones (la primera paga o usa el objeto; la segunda no)
  const isPair = isMoney || isItem;
  const price = /^\d+$/.test(amount.trim()) && Number(amount) > 0 ? formatMoney(Number(amount)) : 'el monto';
  const usedItem = itemById(decisionItem)?.name;
  // Al pasar a una decisión de dinero o de objeto, quedan exactamente dos opciones
  const onDecisionTypeChange = (type: string) => {
    if (type === 'money' || type === 'item') decisions.replace(fitMoneyDecisions(getValues('decisions')));
  };
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
    <form onSubmit={onSubmit} noValidate aria-busy={saving} className="chapter-form__form">
      <DialogTitle>Editar capítulo</DialogTitle>

      {formError && (
        <p role="alert" className="chapter-form__error">
          {formError}
        </p>
      )}

      <fieldset disabled={saving} className="chapter-form__fields">
        <FormField id={id('name')} label="Nombre del capítulo" error={errors.name?.message}>
          {(a11y) => <Input id={id('name')} autoComplete="off" className="chapter-form__control" {...a11y} {...register('name')} />}
        </FormField>

        <div role="group" aria-labelledby={id('fragments')} className={groupClass}>
          <h3 id={id('fragments')} className={groupTitle}>
            Fragmentos
          </h3>
          <ol className="chapter-form__list">
            {fragments.fields.map((field, i) => (
              <li key={field.id} className={itemClass}>
                <div className="chapter-form__item-header">
                  <span className="chapter-form__note">Fragmento {i + 1}</span>
                  {fragments.fields.length > 1 && (
                    <button type="button" className={linkButtonClass} onClick={() => fragments.remove(i)}>
                      Quitar
                    </button>
                  )}
                </div>
                <div className="chapter-form__fragment-grid">
                  <div className="chapter-form__column">
                    <FormField id={id(`fragment-${i}-text`)} label="Texto" labelClassName={subLabel}>
                      {(a11y) => (
                        <Textarea
                          id={id(`fragment-${i}-text`)}
                          rows={3}
                          className={cn('chapter-form__fragment-text', itemField)}
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
                  <div className="chapter-form__column">
                    <div className="chapter-form__preview-header">
                      <span className="chapter-form__preview-label">Vista previa</span>
                      <button
                        type="button"
                        className={cn(linkButtonClass, 'chapter-form__play')}
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
          <button type="button" className={cn(linkButtonClass, 'chapter-form__add')} onClick={() => fragments.append(blankFragment())}>
            + Añadir fragmento
          </button>
        </div>

        <div role="group" aria-labelledby={id('reward')} className={groupClass}>
          <div className="chapter-form__group-heading">
            <h3 id={id('reward')} className={groupTitle}>
              Recompensa
            </h3>
            <p className="chapter-form__note">
              Lo que gana el lector al terminar de leer el capítulo. El dinero y los objetos comunes los gana la primera vez
              que lo lee (al releerlo, solo si ya no le quedan); un objeto único, solo si no lo tiene.
            </p>
          </div>
          <div className="chapter-form__decision-type">
            <FormField id={id('reward-type')} label="Tipo de recompensa" labelClassName={subLabel}>
              {(a11y) => (
                <Select id={id('reward-type')} className="chapter-form__control" {...a11y} {...register('rewardType')}>
                  <option value="none">Sin recompensa</option>
                  <option value="money">Dinero</option>
                  <option value="item">Objetos</option>
                </Select>
              )}
            </FormField>
            {rewardType === 'money' && (
              <FormField id={id('reward-amount')} label="Monedas que gana" error={errors.rewardAmount?.message} labelClassName={subLabel}>
                {(a11y) => (
                  <Input
                    id={id('reward-amount')}
                    type="number"
                    min={1}
                    step={1}
                    inputMode="numeric"
                    className="chapter-form__control"
                    {...a11y}
                    {...register('rewardAmount')}
                  />
                )}
              </FormField>
            )}
          </div>
          {rewardType === 'item' && (
            <>
              {errors.rewardItems?.message && <p className="chapter-form__field-error">{errors.rewardItems.message}</p>}
              {!!rewardItems.fields.length && (
                <ul className="chapter-form__reward-items">
                  {rewardItems.fields.map((field, i) => {
                    const item = itemById(rewardList[i]?.itemId ?? field.itemId);
                    return (
                      <li key={field.id} className="chapter-form__reward-item">
                        <span className="chapter-form__reward-name">
                          {item?.name ?? 'Objeto que ya no existe'}
                          <span className="chapter-form__reward-kind">{item?.stackable ? 'común' : 'único'}</span>
                        </span>
                        {/* De un objeto único solo se gana uno; de uno común, la cantidad que se diga */}
                        {item?.stackable && (
                          <FormField
                            id={id(`reward-item-${i}-quantity`)}
                            label="Cantidad"
                            error={errors.rewardItems?.[i]?.quantity?.message}
                            labelClassName="visually-hidden"
                          >
                            {(a11y) => (
                              <Input
                                id={id(`reward-item-${i}-quantity`)}
                                type="number"
                                min={1}
                                max={99}
                                step={1}
                                inputMode="numeric"
                                className="chapter-form__reward-quantity"
                                {...a11y}
                                {...register(`rewardItems.${i}.quantity`)}
                              />
                            )}
                          </FormField>
                        )}
                        <button type="button" className={linkButtonClass} onClick={() => rewardItems.remove(i)}>
                          Quitar
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
              {rewardItems.fields.length < 20 && (
                <div className="chapter-form__reward-add">
                  <FormField id={id('reward-pick')} label="Añadir objeto" labelClassName={subLabel}>
                    {(a11y) => (
                      <ItemSelect
                        id={id('reward-pick')}
                        value={pick}
                        onChange={setPick}
                        exclude={rewardList.map((r) => r.itemId)}
                        {...a11y}
                      />
                    )}
                  </FormField>
                  <button type="button" className={cn(linkButtonClass, 'chapter-form__add')} disabled={!pick} onClick={addRewardItem}>
                    + Añadir a la recompensa
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <div role="group" aria-labelledby={id('final')} className={groupClass}>
          <h3 id={id('final')} className={groupTitle}>
            ¿Es un capítulo final?
          </h3>
          <div className="chapter-form__toggles">
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
            <div className="chapter-form__group-heading">
              <h3 id={id('decisions')} className={groupTitle}>
                Decisiones
              </h3>
              <p className="chapter-form__note">
                Opciones hacia otros capítulos. Cada una lleva a un capítulo que ya existe o a uno nuevo, que se crea vacío
                y con el nombre de la decisión al guardar.
              </p>
            </div>
            <div className="chapter-form__decision-type">
              <FormField id={id('decision-type')} label="Tipo de decisión" labelClassName={subLabel}>
                {(a11y) => (
                  <Select
                    id={id('decision-type')}
                    className="chapter-form__control"
                    {...a11y}
                    {...register('decisionType', { onChange: (e) => onDecisionTypeChange(e.target.value) })}
                  >
                    <option value="choose">Elegir · todas las opciones son gratis</option>
                    <option value="money">Dinero · la primera opción se paga</option>
                    <option value="item">Objeto · la primera opción usa un objeto</option>
                  </Select>
                )}
              </FormField>
              {isMoney && (
                <FormField id={id('amount')} label="Monedas que cuesta" error={errors.amount?.message} labelClassName={subLabel}>
                  {(a11y) => (
                    <Input
                      id={id('amount')}
                      type="number"
                      min={1}
                      step={1}
                      inputMode="numeric"
                      className="chapter-form__control"
                      {...a11y}
                      {...register('amount')}
                    />
                  )}
                </FormField>
              )}
            </div>
            {isItem && (
              <div className="chapter-form__item-decision">
                <FormField id={id('decision-item')} label="Objeto que pide" error={errors.item?.message} labelClassName={subLabel}>
                  {(a11y) => (
                    <ItemSelect
                      id={id('decision-item')}
                      value={decisionItem}
                      onChange={(itemId) => setValue('item', itemId, { shouldValidate: !!errors.item })}
                      {...a11y}
                    />
                  )}
                </FormField>
                <label className="chapter-form__check">
                  <input type="checkbox" {...register('removeItem')} />
                  <span>Se quita del inventario al usarlo</span>
                </label>
              </div>
            )}
            {isMoney && (
              <p className="chapter-form__note">
                El lector paga {price} para tomar la primera decisión; la segunda es el otro camino, gratis. Si no le
                alcanza, solo puede tomar la segunda.
              </p>
            )}
            {isItem && (
              <p className="chapter-form__note">
                Para tomar la primera decisión el lector tiene que llevar {usedItem ? `«${usedItem}»` : 'el objeto'}; la segunda
                es el otro camino. Si no lo tiene, solo puede tomar la segunda.
              </p>
            )}
            {errors.decisions?.message && <p className="chapter-form__field-error">{errors.decisions.message}</p>}
            <ol className="chapter-form__list">
              {decisions.fields.map((field, i) => (
                <li key={field.id} className={itemClass}>
                  <div className="chapter-form__item-header">
                    <span className="chapter-form__note">
                      Decisión {i + 1}
                      {isMoney && (i === 0 ? ` · se paga ${price}` : ' · sin pagar')}
                      {isItem && (i === 0 ? ` · usa ${usedItem ? `«${usedItem}»` : 'el objeto'}` : ' · sin usarlo')}
                    </span>
                    {!isPair && (
                      <button type="button" className={linkButtonClass} onClick={() => decisions.remove(i)}>
                        Quitar
                      </button>
                    )}
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
                        className={cn('chapter-form__decision-description', itemField)}
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
            {!isPair && decisions.fields.length < 10 && (
              <button type="button" className={cn(linkButtonClass, 'chapter-form__add')} onClick={() => decisions.append(blankDecision())}>
                + Añadir decisión
              </button>
            )}
          </div>
        )}

        {isFinal && (
          <div role="group" aria-labelledby={id('end')} className={groupClass}>
            <div className="chapter-form__group-heading">
              <h3 id={id('end')} className={groupTitle}>
                Lugar de finalización
              </h3>
              <p className="chapter-form__note">La historia termina aquí, en una ciudad o un lugar.</p>
            </div>
            <FormField id={id('end-kind')} label="Apunta a" labelClassName={cn(subLabel, 'chapter-form__sublabel--muted')}>
              {(a11y) => (
                <Select id={id('end-kind')} className="chapter-form__control" {...a11y} {...register('endKind')}>
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

      <div className="chapter-form__actions">
        <Button type="submit" size="md" className="chapter-form__submit" loading={saving} disabled={!name.trim()}>
          {saving ? 'Guardando' : 'Guardar capítulo'}
        </Button>
        <button type="button" className={linkButtonClass} disabled={saving} onClick={onDone}>
          Cancelar
        </button>
        <span role="status" className="visually-hidden">
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
        'chapter-form__toggle',
        pressed ? 'chapter-form__toggle--on' : 'chapter-form__toggle--off',
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
    <FormField id={id} label="Ciudad" error={error} labelClassName={cn(subLabel, 'chapter-form__sublabel--muted')}>
      {/* Hasta tener las opciones no se registra el campo: así el select muestra el valor guardado al montarse */}
      {(a11y) =>
        isPending ? (
          <LoadingSelect id={id} label="Cargando ciudades…" />
        ) : (
        <Select id={id} className="chapter-form__control" {...a11y} {...register('cityId', { onChange })}>
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
    <Select id={id} className="chapter-form__control" disabled>
      <option>{label}</option>
    </Select>
  );
}

function PlaceSelect({ id, cityId, register, error }: RegisterProp & { cityId: string }) {
  const { data: places, isPending } = useCityPlaces(cityId);
  return (
    <FormField id={id} label="Lugar" error={error} labelClassName={cn(subLabel, 'chapter-form__sublabel--muted')}>
      {(a11y) =>
        isPending ? (
          <LoadingSelect id={id} label="Cargando lugares…" />
        ) : (
        <Select id={id} className="chapter-form__control" {...a11y} {...register('placeId')}>
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
