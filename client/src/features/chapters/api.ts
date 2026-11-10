import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { chapterSchema, npcSchema, type UpdateChapterInput } from '@wos/shared';
import { api } from '@/lib/api';

export const chaptersQueryKey = (npcId: string) => ['npcs', npcId, 'chapters'] as const;

/** Un NPC (para el encabezado de su página de capítulos). */
export function useNpc(npcId: string) {
  return useQuery({
    queryKey: ['npcs', npcId],
    queryFn: ({ signal }) => api(`/npcs/${npcId}`, { schema: npcSchema, signal }),
  });
}

/** Modo escritor: todos los capítulos de un NPC completos (el primero es el inicio de la historia). */
export function useChapters(npcId: string) {
  return useQuery({
    queryKey: chaptersQueryKey(npcId),
    queryFn: ({ signal }) => api(`/writer/npcs/${npcId}/chapters`, { schema: z.array(chapterSchema), signal }),
  });
}

/*
 * Editar, publicar o borrar un capítulo cambia también otros: crea capítulos nuevos desde las decisiones, publica
 * en cadena o quita opciones que llevaban al borrado. Por eso cada mutación vuelve a pedir la lista entera y no
 * termina hasta tenerla (así el loader cubre también esa espera).
 */
function useRefreshChapters(npcId: string) {
  const queryClient = useQueryClient();
  return () => queryClient.invalidateQueries({ queryKey: chaptersQueryKey(npcId) });
}

export function useUpdateChapter(npcId: string) {
  const refresh = useRefreshChapters(npcId);
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateChapterInput }) =>
      api(`/chapters/${id}`, { method: 'PATCH', body, schema: chapterSchema }),
    onSuccess: refresh,
  });
}

/** Publicar publica en cadena los capítulos sin publicar a los que llevan sus decisiones (lo hace el server). */
export function usePublishChapter(npcId: string) {
  const refresh = useRefreshChapters(npcId);
  return useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      api(`/chapters/${id}/publish`, { method: 'PATCH', body: { published }, schema: chapterSchema }),
    onSuccess: refresh,
  });
}

/** Borrar un capítulo quita también las opciones de las decisiones que llevaban a él. */
export function useDeleteChapter(npcId: string) {
  const refresh = useRefreshChapters(npcId);
  return useMutation({
    mutationFn: (id: string) => api(`/chapters/${id}`, { method: 'DELETE' }),
    onSuccess: refresh,
  });
}
