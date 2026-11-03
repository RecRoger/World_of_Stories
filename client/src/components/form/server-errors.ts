import type { FieldValues, Path, UseFormSetError } from 'react-hook-form';
import { ApiError } from '@/lib/api';

/**
 * Lleva los `fieldErrors` de un 400 del server a sus campos del formulario.
 * Devuelve el mensaje general a mostrar, o `null` si todo quedó asignado a algún campo.
 */
export function applyServerErrors<T extends FieldValues>(err: unknown, setError: UseFormSetError<T>, fields: Path<T>[]) {
  if (!(err instanceof ApiError)) return 'Algo salió mal, inténtalo de nuevo';

  const fieldErrors = (err.details as { fieldErrors?: Record<string, string[] | undefined> } | undefined)?.fieldErrors;
  let assigned = false;
  for (const field of fields) {
    const message = fieldErrors?.[field]?.[0];
    if (message) {
      setError(field, { type: 'server', message });
      assigned = true;
    }
  }
  return assigned ? null : err.message;
}
