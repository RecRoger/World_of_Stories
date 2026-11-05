import type { ReactNode } from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

const fieldLabel = 'font-display text-2xl font-bold';

export type FieldA11y = { 'aria-invalid'?: true; 'aria-describedby'?: string };
type FormFieldProps = {
  id: string;
  label: string;
  hint?: string;
  error?: string;
  labelClassName?: string;
  children: (a11y: FieldA11y) => ReactNode;
};

/** Etiqueta, pista y error de un campo; `children` recibe los atributos que los enlazan al control. */
export function FormField({ id, label, hint, error, labelClassName, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;
  return (
    <div className="flex flex-col gap-2">
      <Label htmlFor={id} className={cn(fieldLabel, labelClassName)}>
        {label}
      </Label>
      {hint && (
        <p id={hintId} className="text-[17px] text-ink-muted">
          {hint}
        </p>
      )}
      {children({ 'aria-invalid': error ? true : undefined, 'aria-describedby': describedBy })}
      {error && (
        <p id={errorId} className="text-base text-danger">
          {error}
        </p>
      )}
    </div>
  );
}
