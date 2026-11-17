import type { ComponentProps } from 'react';
import { Link, type LinkProps } from 'react-router';
import { cn } from '@/lib/utils';
import './icon-button.scss';

type IconButtonProps = ComponentProps<'button'> & { label: string };

/** Botón de solo icono (44×44). `label` es su nombre accesible y su tooltip. */
export function IconButton({ label, className, type = 'button', ...props }: IconButtonProps) {
  return <button type={type} aria-label={label} title={label} className={cn('icon-button', className)} {...props} />;
}

/** Igual que `IconButton`, pero navega (p. ej. "Editar"). */
export function IconLink({ label, className, ...props }: LinkProps & { label: string }) {
  return <Link aria-label={label} title={label} className={cn('icon-button', className)} {...props} />;
}
