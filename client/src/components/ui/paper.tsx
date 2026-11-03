import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';

/** Hoja de papel con páginas apiladas debajo: la superficie base del diseño. */
export function Paper({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="paper" className={cn('box-border bg-paper shadow-paper', className)} {...props} />;
}
