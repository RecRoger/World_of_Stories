import type { ToObjectOptions } from 'mongoose';

type Ret = Record<string, unknown>;

/**
 * Opciones de serialización comunes: expone `id` en lugar de `_id` y quita `__v`.
 * `rename` permite publicar un campo de BD con otro nombre en la API (p. ej. events -> npcIds).
 */
export function jsonOptions(rename: Record<string, string> = {}, omit: string[] = []): ToObjectOptions {
  return {
    virtuals: true,
    versionKey: false,
    transform(_doc, ret: Ret) {
      delete ret._id;
      for (const [from, to] of Object.entries(rename)) {
        if (from in ret) {
          ret[to] = ret[from];
          delete ret[from];
        }
      }
      for (const key of omit) delete ret[key];
      return ret;
    },
  };
}
