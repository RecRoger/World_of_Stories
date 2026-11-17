import { useId, useState, type KeyboardEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { ApiError } from '@/lib/api';
import { cn } from '@/lib/utils';
import '@/components/ui/link-button.scss';
import './inline-editor.scss';

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

/** Botón con aspecto de enlace subrayado (Cancelar, Quitar, + Añadir…), compartido por las vistas de escritor. */
export const linkButtonClass = 'link-button';

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
      className={cn('inline-editor', fill && 'inline-editor--fill', className)}
      onSubmit={(e) => {
        e.preventDefault();
        void submit();
      }}
    >
      {multiline ? (
        <Textarea
          rows={4}
          className={cn('inline-editor__textarea', fill && 'inline-editor__textarea--fill')}
          onChange={(e) => setValue(e.target.value)}
          {...fieldProps}
        />
      ) : (
        <Input className="inline-editor__input" onChange={(e) => setValue(e.target.value)} {...fieldProps} />
      )}
      {error && (
        <p id={errorId} role="alert" className="inline-editor__error">
          {error}
        </p>
      )}
      <div className="inline-editor__actions">
        <Button type="submit" size="md" className="inline-editor__submit" loading={saving} disabled={empty}>
          {saving ? 'Guardando' : submitLabel}
        </Button>
        <button type="button" className={linkButtonClass} disabled={saving} onClick={onCancel}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
