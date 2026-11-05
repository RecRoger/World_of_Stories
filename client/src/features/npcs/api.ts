import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { npcSchema, placeSchema, type CreateNpcInput, type Npc, type UpdateNpcInput } from '@wos/shared';
import { api } from '@/lib/api';

export const npcsQueryKey = (placeId: string) => ['places', placeId, 'npcs'] as const;

/** Un lugar (para el encabezado de su página de eventos). */
export function usePlace(placeId: string) {
  return useQuery({
    queryKey: ['places', placeId],
    queryFn: ({ signal }) => api(`/places/${placeId}`, { schema: placeSchema, signal }),
  });
}

/** Modo escritor: los NPCs (eventos) de un lugar con toda su información, sin publicar incluidos. */
export function useNpcs(placeId: string) {
  return useQuery({
    queryKey: npcsQueryKey(placeId),
    queryFn: ({ signal }) => api(`/writer/places/${placeId}/npcs`, { schema: z.array(npcSchema), signal }),
  });
}

function useStoreNpc(placeId: string) {
  const queryClient = useQueryClient();
  return (npc: Npc) =>
    queryClient.setQueryData<Npc[]>(npcsQueryKey(placeId), (list) =>
      list && (list.some((n) => n.id === npc.id) ? list.map((n) => (n.id === npc.id ? npc : n)) : [...list, npc]),
    );
}

export function useCreateNpc(placeId: string) {
  const store = useStoreNpc(placeId);
  return useMutation({
    mutationFn: (body: CreateNpcInput) => api(`/places/${placeId}/npcs`, { method: 'POST', body, schema: npcSchema }),
    onSuccess: store,
  });
}

/** Editar el NPC entero (el formulario del modal). Solo su autor o un admin. */
export function useUpdateNpc(placeId: string) {
  const store = useStoreNpc(placeId);
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateNpcInput }) =>
      api(`/npcs/${id}`, { method: 'PATCH', body, schema: npcSchema }),
    onSuccess: store,
  });
}

/** Publicar un NPC publica también sus textos (lo hace el server). */
export function usePublishNpc(placeId: string) {
  const store = useStoreNpc(placeId);
  return useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      api(`/npcs/${id}/publish`, { method: 'PATCH', body: { published }, schema: npcSchema }),
    onSuccess: store,
  });
}

export function useDeleteNpc(placeId: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`/npcs/${id}`, { method: 'DELETE' }),
    onSuccess: (_, id) => queryClient.setQueryData<Npc[]>(npcsQueryKey(placeId), (list) => list?.filter((n) => n.id !== id)),
  });
}
