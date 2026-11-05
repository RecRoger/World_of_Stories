import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      className={cn(
        'box-border min-h-12 w-full rounded-[2px] border border-ink bg-parchment px-3.5 font-serif text-[19px] text-ink',
        'focus-visible:outline-offset-2 aria-invalid:border-danger aria-invalid:border-2 disabled:opacity-60',
        className,
      )}
      {...props}
    />
  );
}
