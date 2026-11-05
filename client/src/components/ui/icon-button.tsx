import type { ComponentProps } from 'react';
import { Link, type LinkProps } from 'react-router';
import { cn } from '@/lib/utils';

const iconButtonClass = cn(
  'inline-flex size-11 cursor-pointer items-center justify-center rounded-[2px] border-0 bg-transparent p-0 text-ink-muted transition-colors',
  'hover:bg-ink/8 hover:text-ink disabled:pointer-events-none disabled:opacity-50 aria-disabled:cursor-default aria-disabled:opacity-50 focus-visible:outline-offset-3',
);

type IconButtonProps = ComponentProps<'button'> & { label: string };

/** Botón de solo icono (44×44). `label` es su nombre accesible y su tooltip. */
export function IconButton({ label, className, type = 'button', ...props }: IconButtonProps) {
  return <button type={type} aria-label={label} title={label} className={cn(iconButtonClass, className)} {...props} />;
}

/** Igual que `IconButton`, pero navega (p. ej. "Editar"). */
export function IconLink({ label, className, ...props }: LinkProps & { label: string }) {
  return <Link aria-label={label} title={label} className={cn(iconButtonClass, className)} {...props} />;
}
