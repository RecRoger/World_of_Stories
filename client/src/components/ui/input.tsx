import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import './field-control.scss';

export function Input({ className, ...props }: ComponentProps<'input'>) {
  return (
    <input
      data-slot="input"
      className={cn('input', className)}
      {...props}
    />
  );
}
