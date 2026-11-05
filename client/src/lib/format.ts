const dateFormat = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric' });

/** `2026-10-12T…` → "12 oct 2026" */
export const formatDate = (iso: string) => dateFormat.format(new Date(iso)).replace('.', '');

/** "Publicada el 12 oct 2026" / "Publicado" / "Sin publicar" (`word` lleva el género: "Publicada" o "Publicado"). */
export function publicationLabel(published: boolean, publishDate: string | null | undefined, word: string) {
  if (!published) return 'Sin publicar';
  return publishDate ? `${word} el ${formatDate(publishDate)}` : word;
}
