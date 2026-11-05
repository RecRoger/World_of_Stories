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
      <DialogTrigger className="box-border flex min-h-[360px] w-full cursor-pointer flex-col items-center justify-center gap-4.5 bg-paper-blank p-8 text-center font-serif text-ink shadow-paper transition-transform duration-250 hover:-translate-y-1">
        <PlusCircleIcon />
        <span className="font-display text-[38px] leading-none font-semibold">{copy.trigger}</span>
        <span className="max-w-[16em] text-[19px] leading-[1.45] text-ink-muted">Empieza en una hoja en blanco.</span>
      </DialogTrigger>

      <DialogContent aria-describedby={undefined} className="px-[clamp(24px,6vw,52px)] pt-12 pb-11">
        <form onSubmit={onSubmit} noValidate aria-busy={saving} className="flex flex-col gap-7">
          <DialogTitle>{copy.title}</DialogTitle>

          {formError && (
            <p role="alert" className="bg-danger/8 px-3.5 py-2.5 text-[17px] text-danger">
              {formError}
            </p>
          )}

          <fieldset disabled={saving} className="m-0 flex min-w-0 flex-col gap-7 border-0 p-0">
            <FormField id={id('name')} label={copy.nameLabel} error={errors.name?.message}>
              {(a11y) => <Input id={id('name')} autoComplete="off" className="min-h-13 text-xl" {...a11y} {...register('name')} />}
            </FormField>
            <FormField id={id('description')} label="Descripción" error={errors.description?.message}>
              {(a11y) => <Textarea id={id('description')} rows={4} className="min-h-28" {...a11y} {...register('description')} />}
            </FormField>
            <FormField id={id('second')} label={copy.second.label} hint={copy.second.hint} error={errors.second?.message}>
              {(a11y) => <Textarea id={id('second')} rows={4} className="min-h-28" {...a11y} {...register('second')} />}
            </FormField>
          </fieldset>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-ink pt-7">
            <Button type="submit" size="md" className="min-h-13 px-9 text-xl" loading={saving} disabled={!complete}>
              {saving ? 'Guardando' : copy.submit}
            </Button>
            <button
              type="button"
              disabled={saving}
              onClick={() => onOpenChange(false)}
              className="min-h-11 cursor-pointer border-0 bg-transparent px-1.5 font-serif text-[17px] text-ink underline underline-offset-4 hover:decoration-2 disabled:cursor-default disabled:opacity-40"
            >
              Cancelar
            </button>
            <span role="status" className="sr-only">
              {saving ? copy.saving : ''}
            </span>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
