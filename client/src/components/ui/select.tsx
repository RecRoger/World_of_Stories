import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/** Select nativo con el estilo de la casa (accesible y usable en móvil sin más). */
export function Select({ className, ...props }: ComponentProps<'select'>) {
  return (
    <select
      data-slot="select"
      className={cn(
        'box-border min-h-12 w-full cursor-pointer rounded-[2px] border border-ink bg-parchment px-3 font-serif text-[19px] text-ink',
        'focus-visible:outline-offset-2 disabled:cursor-default disabled:opacity-60 aria-invalid:border-2 aria-invalid:border-danger',
        className,
      )}
      {...props}
    />
  );
}
