import { HttpError } from '../lib/http-error.js';
import { isAdmin, type AuthUser } from '../lib/route.js';

/**
 * Editar/publicar: el autor, un admin, o cualquier escritor si el recurso no tiene dueño
 * (datos antiguos o contenido colaborativo).
 */
export function assertCanEdit(user: AuthUser, owner?: string | null) {
  if (isAdmin(user) || !owner || owner === user.username) return;
  throw HttpError.forbidden(`Solo ${owner} o un administrador pueden modificar esto`);
}

/** Borrar: solo el autor o un admin */
export function assertCanDelete(user: AuthUser, owner?: string | null) {
  if (isAdmin(user) || (owner && owner === user.username)) return;
  throw HttpError.forbidden('Solo el autor o un administrador pueden borrar esto');
}

export function setPublished(target: { published: boolean; publishDate?: Date | null }, published: boolean) {
  target.published = published;
  target.publishDate = published ? new Date() : null;
}
