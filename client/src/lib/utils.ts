import { clsx, type ClassValue } from 'clsx';

/** Une clases condicionales: `cn('button', primary && 'button--primary', className)`. */
export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}
