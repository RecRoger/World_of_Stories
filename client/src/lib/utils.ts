import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/** Une clases condicionales y resuelve conflictos de Tailwind (`px-4` + `px-6` → `px-6`). */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
