import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import {
  chapterSchema,
  characterSchema,
  cityReadingSchema,
  npcReadingSchema,
  placeReadingSchema,
  type Character,
  type CreateCharacterInput,
  type UpdateCharacterInput,
} from '@wos/shared';
import { api } from '@/lib/api';

/*
 * Modo lector: solo lo publicado, con UNA versión al azar de cada descripción y extracto (la elige el server
 * en cada petición). Se piden una vez por visita (`staleTime: Infinity`) para que el texto no cambie mientras
 * se lee; al volver a entrar se elige otra.
 */
const once = { staleTime: Infinity } as const;

export const charactersQueryKey = ['me', 'characters'] as const;

export function useCharacters() {
  return useQuery({
    queryKey: charactersQueryKey,
    queryFn: ({ signal }) => api('/me/characters', { schema: z.array(characterSchema), signal }),
  });
}

export function useCreateCharacter() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: CreateCharacterInput) => api('/me/characters', { method: 'POST', body, schema: characterSchema }),
    onSuccess: (character) =>
      queryClient.setQueryData<Character[]>(charactersQueryKey, (list) => (list ? [...list, character] : list)),
  });
}

/**
 * Mueve al personaje. La vista cambia al instante (se actualiza la caché antes de responder el server)
 * y, si falla, se vuelve a pedir el listado.
 */
export function useMoveCharacter(characterId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (location: UpdateCharacterInput['location']) =>
      api(`/me/characters/${characterId}`, { method: 'PATCH', body: { location }, schema: characterSchema }),
    onMutate: (location) => {
      queryClient.setQueryData<Character[]>(charactersQueryKey, (list) =>
        list?.map((c) => (c.id === characterId ? { ...c, location: location ?? null } : c)),
      );
    },
    onSuccess: (character) =>
      queryClient.setQueryData<Character[]>(charactersQueryKey, (list) => list?.map((c) => (c.id === character.id ? character : c))),
    onError: () => queryClient.invalidateQueries({ queryKey: charactersQueryKey }),
  });
}

export function useReadingCities() {
  return useQuery({
    queryKey: ['reading', 'cities'],
    queryFn: ({ signal }) => api('/cities', { schema: z.array(cityReadingSchema), signal }),
    ...once,
  });
}

export function useReadingPlaces(cityId: string | undefined) {
  return useQuery({
    queryKey: ['reading', 'cities', cityId, 'places'],
    queryFn: ({ signal }) => api(`/cities/${cityId}/places`, { schema: z.array(placeReadingSchema), signal }),
    enabled: !!cityId,
    ...once,
  });
}

export function useReadingNpcs(placeId: string | undefined) {
  return useQuery({
    queryKey: ['reading', 'places', placeId, 'npcs'],
    queryFn: ({ signal }) => api(`/places/${placeId}/npcs`, { schema: z.array(npcReadingSchema), signal }),
    enabled: !!placeId,
    ...once,
  });
}

export function useReadingChapter(chapterId: string | undefined) {
  return useQuery({
    queryKey: ['reading', 'chapters', chapterId],
    queryFn: ({ signal }) => api(`/chapters/${chapterId}`, { schema: chapterSchema, signal }),
    enabled: !!chapterId,
    ...once,
  });
}

/** Marca un texto como leído por el personaje (el id de la versión del relato, o el del capítulo). */
export function useMarkRead(characterId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (fragmentId: string) =>
      api(`/me/characters/${characterId}/read`, { method: 'POST', body: { fragmentId }, schema: characterSchema }),
    onSuccess: (character) =>
      queryClient.setQueryData<Character[]>(charactersQueryKey, (list) => list?.map((c) => (c.id === character.id ? character : c))),
  });
}
