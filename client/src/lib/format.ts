const dateFormat = new Intl.DateTimeFormat('es', { day: 'numeric', month: 'short', year: 'numeric' });

/** `2026-10-12T…` → "12 oct 2026" */
export const formatDate = (iso: string) => dateFormat.format(new Date(iso)).replace('.', '');

/** "Publicada el 12 oct 2026" / "Publicado" / "Sin publicar" (`word` lleva el género: "Publicada" o "Publicado"). */
export function publicationLabel(published: boolean, publishDate: string | null | undefined, word: string) {
  if (!published) return 'Sin publicar';
  return publishDate ? `${word} el ${formatDate(publishDate)}` : word;
}

const numberFormat = new Intl.NumberFormat('es');

/** 1 → "1 moneda", 1500 → "1500 monedas" (el dinero del personaje y lo que cuesta una decisión) */
export const formatMoney = (amount: number) => `${numberFormat.format(amount)} ${amount === 1 ? 'moneda' : 'monedas'}`;
