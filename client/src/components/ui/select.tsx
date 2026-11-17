import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import './field-control.scss';

/** Select nativo con el estilo de la casa (accesible y usable en móvil sin más). */
export function Select({ className, ...props }: ComponentProps<'select'>) {
  return (
    <select
      data-slot="select"
      className={cn('select', className)}
      {...props}
    />
  );
}
