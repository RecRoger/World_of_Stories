import { useState } from 'react';
import { useParams } from 'react-router';
import { PlusCircleIcon } from '@/components/icons';
import { LocationGrid, WriterPageHeading } from '@/features/locations/location-grid';
import { useNpcs, usePlace } from '@/features/npcs/api';
import { NpcCard } from '@/features/npcs/npc-card';
import { NpcFormDialog } from '@/features/npcs/npc-form-dialog';
import './writer-page.scss';
import './place-events-page.scss';

/** 7 · Eventos y NPCs de un lugar (se llega desde "Ver eventos" en su tarjeta). */
export function PlaceEventsPage() {
  const { cityId = '', placeId = '' } = useParams();
  const { data: place } = usePlace(placeId);
  const { data: npcs, isPending, isError, refetch } = useNpcs(placeId);
  const [creating, setCreating] = useState(false);

  return (
    <div className="writer-page">
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
          className="place-events-page__new"
        >
          <PlusCircleIcon />
          <span className="place-events-page__new-title">Añadir nuevo evento</span>
          <span className="place-events-page__new-text">Empieza en una hoja en blanco.</span>
        </button>
      </LocationGrid>
      <NpcFormDialog placeId={placeId} open={creating} onOpenChange={setCreating} />
    </div>
  );
}
