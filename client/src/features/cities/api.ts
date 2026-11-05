import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { citySchema, type CreateCityInput } from '@wos/shared';
import { api } from '@/lib/api';
import { textToTale } from '@/features/locations/narrative';
import type { NewLocationValues } from '@/features/locations/new-location-dialog';
import { cityResource } from '@/features/locations/resource';

// Renombrar, publicar, borrar y los extractos son comunes con los lugares: ver features/locations/api.ts

/**
 * Modo escritor: todas las ciudades con toda su información (todas las versiones de descripción y viaje,
 * también las sin publicar). Las tarjetas se pintan y editan directamente con esto.
 */
export function useCities() {
  return useQuery({
    queryKey: cityResource.listKey,
    queryFn: ({ signal }) => api('/writer/cities', { schema: z.array(citySchema), signal }),
  });
}

/** Ficha de una ciudad (para páginas que solo necesitan una, como sus lugares). */
export function useCity(id: string) {
  return useQuery({
    queryKey: [...cityResource.listKey, id],
    queryFn: ({ signal }) => api(`/cities/${id}`, { schema: citySchema, signal }),
  });
}

export function useCreateCity() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ name, description, second }: NewLocationValues) =>
      api('/cities', {
        method: 'POST',
        body: { name, description: textToTale(description), travel: textToTale(second) } satisfies CreateCityInput,
        schema: citySchema,
      }),
    // El listado se vuelve a pedir: la ciudad nueva entra en su sitio (orden alfabético)
    onSuccess: () => queryClient.invalidateQueries({ queryKey: cityResource.listKey, exact: true }),
  });
}
