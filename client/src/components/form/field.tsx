import { useId, type ComponentProps } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type FieldProps = ComponentProps<'input'> & { label: string; error?: string };

/** Etiqueta + input + mensaje de error, enlazados para lectores de pantalla. */
export function Field({ label, error, id, ...props }: FieldProps) {
  const autoId = useId();
  const inputId = id ?? autoId;
  const errorId = `${inputId}-error`;

  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={inputId}>{label}</Label>
      <Input id={inputId} aria-invalid={error ? true : undefined} aria-describedby={error ? errorId : undefined} {...props} />
      {error && (
        <p id={errorId} className="text-base text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
