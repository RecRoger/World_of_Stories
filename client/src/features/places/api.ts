import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { placeSchema, type CreatePlaceInput, type Place } from '@wos/shared';
import { api } from '@/lib/api';
import { textToTale } from '@/features/locations/narrative';
import type { NewLocationValues } from '@/features/locations/new-location-dialog';
import { placesResource } from '@/features/locations/resource';

// Renombrar, publicar, borrar y los extractos son comunes con las ciudades: ver features/locations/api.ts

/** Modo escritor: los lugares de una ciudad con toda su información (todas las versiones de descripción y entrada). */
export function useCityPlaces(cityId: string) {
  return useQuery({
    queryKey: placesResource(cityId).listKey,
    queryFn: ({ signal }) => api(`/writer/cities/${cityId}/places`, { schema: z.array(placeSchema), signal }),
  });
}

export function useCreatePlace(cityId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, description, second }: NewLocationValues) =>
      api(`/cities/${cityId}/places`, {
        method: 'POST',
        body: { name, description: textToTale(description), entry: textToTale(second) } satisfies CreatePlaceInput,
        schema: placeSchema,
      }),
    // Los lugares se listan en orden de creación: el nuevo va al final
    onSuccess: (place) =>
      queryClient.setQueryData<Place[]>(placesResource(cityId).listKey, (list) => (list ? [...list, place] : list)),
  });
}
