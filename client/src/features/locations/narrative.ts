import type { Readable, ReadableInput } from '@wos/shared';

/*
 * Los extractos de ciudades y lugares (descripciones, viajes, entradas) se escriben como texto corrido:
 * cada párrafo es un fragmento del relato y todos usan la animación "Normal" (`default`).
 */

/** Fragmentos guardados → texto del textarea (un párrafo por fragmento). */
export const taleToText = (tale: Readable[]) => tale.map((r) => r.text.trim()).filter(Boolean).join('\n\n');

/** Texto del textarea → fragmentos para la API. */
export const textToTale = (text: string): ReadableInput[] =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => ({ text: p, animation: 'default' }));

/** Relatos con versiones: los de ciudades son `description` y `travel`; los de lugares, `description` y `entry`. */
export type TaleKind = 'description' | 'travel' | 'entry';

type TaleLabels = { tab: string; add: string; plural: string; item: string; published: string };

export const TALE_LABELS: Record<TaleKind, TaleLabels> = {
  description: { tab: 'Descripciones', add: 'Añadir nueva descripción', plural: 'descripciones', item: 'descripción', published: 'Publicada' },
  travel: { tab: 'Viajes', add: 'Añadir nuevo viaje', plural: 'viajes', item: 'viaje', published: 'Publicado' },
  entry: { tab: 'Entradas', add: 'Añadir nueva entrada', plural: 'entradas', item: 'entrada', published: 'Publicada' },
};
