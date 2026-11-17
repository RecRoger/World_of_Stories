import type { ComponentProps } from 'react';
import { Slot } from 'radix-ui';
import { cn } from '@/lib/utils';
import { WritingDots } from './writing-dots';
import './button.scss';

type ButtonVariant = 'primary' | 'ghost';
type ButtonSize = 'md' | 'lg';

type ButtonProps = ComponentProps<'button'> & {
  /** `primary`: tinta sobre pergamino con canto; `ghost`: transparente. */
  variant?: ButtonVariant;
  size?: ButtonSize;
  asChild?: boolean;
  /** Petición en curso: deshabilita el botón y escribe los puntos suspensivos tras el texto. */
  loading?: boolean;
};

export function Button({ className, variant = 'primary', size = 'lg', asChild = false, loading = false, disabled, children, ...props }: ButtonProps) {
  const classes = cn('button', `button--${variant}`, `button--${size}`, className);
  if (asChild) {
    return (
      <Slot.Root data-slot="button" className={classes} {...props}>
        {children}
      </Slot.Root>
    );
  }
  return (
    <button data-slot="button" className={classes} disabled={disabled || loading} aria-busy={loading || undefined} {...props}>
      {loading ? (
        <span className="button__loading">
          {children}
          <WritingDots delayed={false} />
        </span>
      ) : (
        children
      )}
    </button>
  );
}
