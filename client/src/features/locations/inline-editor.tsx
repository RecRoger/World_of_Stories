import { useId, useState, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ApiError } from '@/lib/api';
import { cn } from '@/lib/utils';

type InlineEditorProps = {
  /** Nombre accesible del campo (no hay etiqueta visible, como en el diseño). */
  label: string;
  initialValue?: string;
  multiline?: boolean;
  /**
   * Ocupa toda la altura de su contenedor: el textarea se estira y se desplaza por dentro, y los botones
   * quedan siempre visibles abajo.
   */
  fill?: boolean;
  submitLabel?: string;
  /** Guarda el valor ya recortado. Mientras la promesa está pendiente, el editor queda bloqueado con el loader. */
  onSubmit: (value: string) => Promise<unknown>;
  onCancel: () => void;
  className?: string;
};

export const linkButtonClass =
  'min-h-11 cursor-pointer border-0 bg-transparent px-1.5 font-serif text-[17px] text-ink underline underline-offset-4 hover:decoration-2 disabled:cursor-default disabled:no-underline disabled:opacity-40';

/** Edición en el sitio (nombre de ciudad, extractos): campo + Aceptar / Cancelar. Escape cancela. */
export function InlineEditor({
  label,
  initialValue = '',
  multiline = false,
  fill = false,
  submitLabel = 'Aceptar',
  onSubmit,
  onCancel,
  className,
}: InlineEditorProps) {
  const [value, setValue] = useState(initialValue);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const errorId = useId();
  const empty = !value.trim();

  const submit = async () => {
    if (empty || saving) return;
    setSaving(true);
    setError(null);
    try {
      await onSubmit(value.trim());
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'No se pudo guardar');
      setSaving(false);
    }
  };

  const onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && !saving) {
      e.stopPropagation();
      onCancel();
    }
  };

  const fieldProps = {
    'aria-label': label,
    'aria-invalid': error ? true : undefined,
    'aria-describedby': error ? errorId : undefined,
    value,
    autoFocus: true,
    disabled: saving,
    onKeyDown,
  } as const;

  return (
    <form
      noValidate
      aria-busy={saving}
      className={cn('flex flex-col gap-2.5', fill && 'h-full min-h-0', className)}
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      {multiline ? (
        <Textarea
          rows={4}
          className={cn('min-h-28 bg-paper', fill && 'min-h-0 flex-1 resize-none field-sizing-fixed')}
          onChange={(e) => setValue(e.target.value)}
          {...fieldProps}
        />
      ) : (
        <Input className="min-h-13 font-display text-2xl font-semibold" onChange={(e) => setValue(e.target.value)} {...fieldProps} />
      )}
      {error && (
        <p id={errorId} role="alert" className="text-base text-danger">
          {error}
        </p>
      )}
      <div className="flex shrink-0 items-center gap-3">
        <Button type="submit" size="md" className="min-h-11 text-lg" loading={saving} disabled={empty}>
          {saving ? 'Guardando' : submitLabel}
        </Button>
        <button type="button" className={linkButtonClass} disabled={saving} onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
