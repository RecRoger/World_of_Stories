import { useState } from 'react';
import { useParams } from 'react-router';
import { PlusCircleIcon } from '@/components/icons';
import { LocationGrid, WriterPageHeading } from '@/features/locations/location-grid';
import { useNpcs, usePlace } from '@/features/npcs/api';
import { NpcCard } from '@/features/npcs/npc-card';
import { NpcFormDialog } from '@/features/npcs/npc-form-dialog';

/** 7 · Eventos y NPCs de un lugar (se llega desde "Ver eventos" en su tarjeta). */
export function PlaceEventsPage() {
  const { cityId = '', placeId = '' } = useParams();
  const { data: place } = usePlace(placeId);
  const { data: npcs, isPending, isError, refetch } = useNpcs(placeId);
  const [creating, setCreating] = useState(false);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-16 pt-14 pb-6">
      <WriterPageHeading title="Eventos y NPCs" subtitle={place?.name} />
      <LocationGrid
        isPending={isPending}
        isError={isError}
        refetch={refetch}
        loadingLabel="Cargando eventos"
        errorLabel="No pudimos cargar los eventos."
      >
        {npcs?.map((npc) => (
          <NpcCard
            key={npc.id}
            placeId={placeId}
            npc={npc}
            chaptersTo={`/write/cities/${cityId}/places/${placeId}/npcs/${npc.id}/chapters`}
          />
        ))}
        <button
          type="button"
          onClick={() => setCreating(true)}
          className="box-border flex min-h-[360px] w-full cursor-pointer flex-col items-center justify-center gap-4.5 border-0 bg-paper-blank p-8 text-center font-serif text-ink shadow-paper transition-transform duration-250 hover:-translate-y-1"
        >
          <PlusCircleIcon />
          <span className="font-display text-[38px] leading-none font-semibold">Añadir nuevo evento</span>
          <span className="max-w-[16em] text-[19px] leading-[1.45] text-ink-muted">Empieza en una hoja en blanco.</span>
        </button>
      </LocationGrid>
      <NpcFormDialog placeId={placeId} open={creating} onOpenChange={setCreating} />
    </div>
  );
}
