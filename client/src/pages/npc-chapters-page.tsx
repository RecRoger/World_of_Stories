import { WriterPageHeading } from '@/features/locations/location-grid';

/** 8 · Capítulos de un NPC de tipo story. Por ahora un marcador: la vista llega con su diseño. */
export function NpcChaptersPage() {
  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-16 pt-14 pb-6">
      <WriterPageHeading title="Capítulos" />
      <p className="text-xl text-ink-muted italic">Este capítulo aún se está escribiendo.</p>
    </div>
  );
}
