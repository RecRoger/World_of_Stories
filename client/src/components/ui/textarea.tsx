import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

export function Textarea({ className, ...props }: ComponentProps<'textarea'>) {
  return (
    <textarea
      data-slot="textarea"
      className={cn(
        'box-border min-h-32 w-full resize-y rounded-[2px] border border-ink bg-parchment px-3.5 py-3 font-serif text-[19px] leading-normal text-ink',
        'field-sizing-content focus-visible:outline-offset-2 aria-invalid:border-2 aria-invalid:border-danger disabled:opacity-60',
        className,
      )}
      {...props}
    />
  );
}
