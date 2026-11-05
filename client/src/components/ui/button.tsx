import type { ComponentProps } from 'react';
import { Slot } from 'radix-ui';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';
import { WritingDots } from './writing-dots';

const buttonVariants = cva(
  'inline-flex cursor-pointer items-center justify-center gap-3 rounded-[2px] font-serif tracking-[0.04em] transition-[transform,background-color] duration-200 disabled:pointer-events-none disabled:opacity-60',
  {
    variants: {
      variant: {
        // Tinta sobre pergamino, con el canto que se levanta al pasar el ratón
        primary: 'bg-ink text-parchment shadow-press hover:-translate-y-0.5 hover:bg-black',
        ghost: 'bg-transparent text-ink hover:bg-ink/5',
      },
      size: {
        md: 'min-h-12 px-6 text-[19px]',
        lg: 'min-h-14 px-9 text-xl',
      },
    },
    defaultVariants: { variant: 'primary', size: 'lg' },
  },
);

type ButtonProps = ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
    /** Petición en curso: deshabilita el botón y escribe los puntos suspensivos tras el texto. */
    loading?: boolean;
  };

export function Button({ className, variant, size, asChild = false, loading = false, disabled, children, ...props }: ButtonProps) {
  const classes = cn(buttonVariants({ variant, size }), className);
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
        <span className="inline-flex items-baseline gap-1">
          {children}
          <WritingDots delayed={false} />
        </span>
      ) : (
        children
      )}
    </button>
  );
}
