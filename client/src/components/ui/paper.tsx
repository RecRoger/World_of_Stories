import type { ComponentProps } from 'react';
import { cn } from '@/lib/utils';
import './paper.scss';

/** Hoja de papel con páginas apiladas debajo: la superficie base del diseño. */
export function Paper({ className, ...props }: ComponentProps<'div'>) {
  return <div data-slot="paper" className={cn('paper', className)} {...props} />;
}
