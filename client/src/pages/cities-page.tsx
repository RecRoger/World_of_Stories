import { useCities, useCreateCity } from '@/features/cities/api';
import { LocationCard } from '@/features/locations/location-card';
import { LocationGrid, WriterPageHeading } from '@/features/locations/location-grid';
import { NewLocationDialog } from '@/features/locations/new-location-dialog';
import { cityResource } from '@/features/locations/resource';

/** 5 · Ciudades: punto de partida de la sección de escritor. */
export function CitiesPage() {
  const { data: cities, isPending, isError, refetch } = useCities();
  const createCity = useCreateCity();

  return (
    <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-16 pt-14 pb-6">
      <WriterPageHeading title="Ciudades" />
      <LocationGrid
        isPending={isPending}
        isError={isError}
        refetch={refetch}
        loadingLabel="Cargando ciudades"
        errorLabel="No pudimos cargar las ciudades."
      >
        {cities?.map((city) => (
          <LocationCard
            key={city.id}
            resource={cityResource}
            entity={city}
            next={{ to: `/write/cities/${city.id}/places`, label: 'Ver lugares' }}
          />
        ))}
        <NewLocationDialog
          idPrefix="city"
          copy={{
            trigger: 'Escribir una nueva ciudad',
            title: 'Nueva ciudad',
            nameLabel: 'Nombre de la ciudad',
            second: { label: 'Relato de viaje', hint: 'Lo que se lee al llegar a la ciudad.' },
            submit: 'Guardar ciudad',
            saving: 'Guardando la ciudad…',
          }}
          onCreate={(values) => createCity.mutateAsync(values)}
        />
      </LocationGrid>
    </div>
  );
}
