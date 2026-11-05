import type { User } from '@wos/shared';

// Mismas reglas que el server (`isWriter`/`isAdmin` en server/src/lib/route.ts)
export const isAdmin = (user?: User | null) => !!user?.roles.includes('Admin');
export const isWriter = (user?: User | null) => !!user?.roles.some((r) => r === 'Writer' || r === 'Admin');

/** Editar, publicar o eliminar: solo su autor o un admin. */
export const canManage = (user: User | null | undefined, author: string | null | undefined) =>
  isAdmin(user) || (!!user && !!author && author === user.username);
