import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { updateCityInputSchema } from '@wos/shared';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { PlusCircleIcon } from '@/components/icons';
import { applyServerErrors } from '@/components/form/server-errors';
import { FormField } from '@/components/form/form-field';
import './new-location-dialog.scss';

const text = z.string().trim().min(1, 'Escribe al menos un párrafo');
const newLocationSchema = z.object({ name: updateCityInputSchema.shape.name, description: text, second: text });
/** `second` es el otro relato: el viaje de una ciudad o la entrada de un lugar. */
export type NewLocationValues = z.infer<typeof newLocationSchema>;

type NewLocationDialogProps = {
  /** Prefijo de los ids de los campos (`city`, `place`). */
  idPrefix: string;
  copy: {
    /** Texto de la tarjeta que abre el modal ("Escribir una nueva ciudad"). */
    trigger: string;
    title: string;
    nameLabel: string;
    second: { label: string; hint: string };
    submit: string;
    /** Para lectores de pantalla mientras se guarda ("Guardando la ciudad…"). */
    saving: string;
  };
  onCreate: (values: NewLocationValues) => Promise<unknown>;
};

/** Tarjeta "nueva ciudad / nuevo lugar" que abre el formulario de creación en un modal. */
export function NewLocationDialog({ idPrefix, copy, onCreate }: NewLocationDialogProps) {
  const [open, setOpen] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const { register, handleSubmit, setError, reset, watch, formState } = useForm<NewLocationValues>({
    resolver: zodResolver(newLocationSchema),
    defaultValues: { name: '', description: '', second: '' },
  });
  const id = (field: string) => `${idPrefix}-${field}`;
  const saving = formState.isSubmitting;
  const { errors } = formState;
  // Como en el diseño: no se puede guardar hasta rellenar los tres campos
  const complete = Object.values(watch()).every((v) => v.trim());

  // Mientras se guarda, el modal no se cierra (ni con Escape, ni con la X, ni pulsando fuera)
  const onOpenChange = (next: boolean) => {
    if (saving) return;
    setOpen(next);
    if (!next) {
      reset();
      setFormError(null);
    }
  };

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    try {
      await onCreate(values);
      onOpenChange(false);
    } catch (err) {
      setFormError(applyServerErrors(err, setError, ['name']));
    }
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogTrigger className="new-location-dialog__trigger">
        <PlusCircleIcon />
        <span className="new-location-dialog__trigger-title">{copy.trigger}</span>
        <span className="new-location-dialog__trigger-text">Empieza en una hoja en blanco.</span>
      </DialogTrigger>

      <DialogContent aria-describedby={undefined} className="new-location-dialog">
        <form onSubmit={onSubmit} noValidate aria-busy={saving} className="new-location-dialog__form">
          <DialogTitle>{copy.title}</DialogTitle>

          {formError && (
            <p role="alert" className="new-location-dialog__error">
              {formError}
            </p>
          )}

          <fieldset disabled={saving} className="new-location-dialog__fields">
            <FormField id={id('name')} label={copy.nameLabel} error={errors.name?.message}>
              {(a11y) => <Input id={id('name')} autoComplete="off" className="new-location-dialog__name" {...a11y} {...register('name')} />}
            </FormField>
            <FormField id={id('description')} label="Descripción" error={errors.description?.message}>
              {(a11y) => <Textarea id={id('description')} rows={4} className="new-location-dialog__textarea" {...a11y} {...register('description')} />}
            </FormField>
            <FormField id={id('second')} label={copy.second.label} hint={copy.second.hint} error={errors.second?.message}>
              {(a11y) => <Textarea id={id('second')} rows={4} className="new-location-dialog__textarea" {...a11y} {...register('second')} />}
            </FormField>
          </fieldset>

          <div className="new-location-dialog__actions">
            <Button type="submit" size="md" className="new-location-dialog__submit" loading={saving} disabled={!complete}>
              {saving ? 'Guardando' : copy.submit}
            </Button>
            <button
              type="button"
              disabled={saving}
              onClick={() => onOpenChange(false)}
              className="new-location-dialog__cancel"
            >
              Cancelar
            </button>
            <span role="status" className="visually-hidden">
              {saving ? copy.saving : ''}
            </span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
