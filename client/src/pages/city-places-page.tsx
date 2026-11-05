import { useParams } from 'react-router';
import { useCity } from '@/features/cities/api';
import { LocationCard } from '@/features/locations/location-card';
import { LocationGrid, WriterPageHeading } from '@/features/locations/location-grid';
import { NewLocationDialog } from '@/features/locations/new-location-dialog';
import { placesResource } from '@/features/locations/resource';
import { useCityPlaces, useCreatePlace } from '@/features/places/api';

/**
 * 6 · Lugares: los lugares de una ciudad (se llega desde "Ver lugares" en su tarjeta). Funciona igual que
 * Ciudades; "Volver a Ciudades" está en la cabecera (ver el `handle` de la ruta).
 */
export function CityPlacesPage() {
  const { cityId = '' } = useParams();
  const { data: city } = useCity(cityId);
  const { data: places, isPending, isError, refetch } = useCityPlaces(cityId);
  const createPlace = useCreatePlace(cityId);
  const resource = placesResource(cityId);

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-16 pt-14 pb-6">
      <WriterPageHeading title="Lugares" subtitle={city?.name} />
      <LocationGrid
        isPending={isPending}
        isError={isError}
        refetch={refetch}
        loadingLabel="Cargando lugares"
        errorLabel="No pudimos cargar los lugares."
      >
        {places?.map((place) => (
          <LocationCard
            key={place.id}
            resource={resource}
            entity={place}
            next={{ to: `/write/cities/${cityId}/places/${place.id}/events`, label: 'Ver eventos' }}
          />
        ))}
        <NewLocationDialog
          idPrefix="place"
          copy={{
            trigger: 'Añadir nuevo lugar',
            title: 'Nuevo lugar',
            nameLabel: 'Nombre del lugar',
            second: { label: 'Texto de entrada', hint: 'Lo que se lee al llegar al lugar.' },
            submit: 'Guardar lugar',
            saving: 'Guardando el lugar…',
          }}
          onCreate={(values) => createPlace.mutateAsync(values)}
        />
      </LocationGrid>
    </div>
  );
}
