import { useMutation, useQueryClient } from '@tanstack/react-query';
import { taleSchema, type Tale } from '@wos/shared';
import { api } from '@/lib/api';
import { textToTale, type TaleKind } from './narrative';
import type { LocationEntity, LocationResource } from './resource';

/*
 * Mutaciones comunes a ciudades y lugares. Cada una actualiza la entidad en su listado de la caché con lo que
 * devuelve la API, sin volver a pedir el listado.
 */

function usePatchEntity(resource: LocationResource) {
  const queryClient = useQueryClient();
  return (id: string, update: (entity: LocationEntity) => LocationEntity) =>
    queryClient.setQueryData<LocationEntity[]>(resource.listKey, (list) => list?.map((e) => (e.id === id ? update(e) : e)));
}

export function useRenameLocation(resource: LocationResource) {
  const patch = usePatchEntity(resource);
  return useMutation({
    mutationFn: ({ id, name }: { id: string; name: string }) =>
      api(resource.path(id), { method: 'PATCH', body: { name }, schema: resource.schema }),
    onSuccess: (entity) => patch(entity.id, () => entity),
  });
}

export function usePublishLocation(resource: LocationResource) {
  const patch = usePatchEntity(resource);
  return useMutation({
    mutationFn: ({ id, published }: { id: string; published: boolean }) =>
      api(`${resource.path(id)}/publish`, { method: 'PATCH', body: { published }, schema: resource.schema }),
    onSuccess: (entity) => patch(entity.id, () => entity),
  });
}

/** Borra la entidad; el server borra en cascada lo que cuelga de ella (lugares, NPCs). */
export function useDeleteLocation(resource: LocationResource) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(resource.path(id), { method: 'DELETE' }),
    onSuccess: (_, id) => {
      queryClient.setQueryData<LocationEntity[]>(resource.listKey, (list) => list?.filter((e) => e.id !== id));
      queryClient.removeQueries({ queryKey: [...resource.listKey, id] });
    },
  });
}

/* Extractos (versiones de un relato) */

type TaleTarget = { resource: LocationResource; id: string; kind: TaleKind };

function useStoreTales({ resource, id, kind }: TaleTarget) {
  const patch = usePatchEntity(resource);
  return (update: (tales: Tale[]) => Tale[]) => patch(id, (entity) => ({ ...entity, [kind]: update(entity[kind] ?? []) }));
}

const talesPath = ({ resource, id, kind }: TaleTarget) => `${resource.path(id)}/${kind}`;

/** Cualquier escritor puede añadir un extracto; queda a su nombre y sin publicar. */
export function useAddTale(target: TaleTarget) {
  const store = useStoreTales(target);
  return useMutation({
    mutationFn: (text: string) => api(talesPath(target), { method: 'POST', body: { tale: textToTale(text) }, schema: taleSchema }),
    onSuccess: (tale) => store((tales) => [...tales, tale]),
  });
}

/** Editar, publicar y borrar: solo su autor o un admin (el server lo comprueba). */
export function useUpdateTale(target: TaleTarget) {
  const store = useStoreTales(target);
  return useMutation({
    mutationFn: ({ taleId, text }: { taleId: string; text: string }) =>
      api(`${talesPath(target)}/${taleId}`, { method: 'PATCH', body: { tale: textToTale(text) }, schema: taleSchema }),
    onSuccess: (tale) => store((tales) => tales.map((t) => (t.id === tale.id ? tale : t))),
  });
}

export function usePublishTale(target: TaleTarget) {
  const store = useStoreTales(target);
  return useMutation({
    mutationFn: ({ taleId, published }: { taleId: string; published: boolean }) =>
      api(`${talesPath(target)}/${taleId}/publish`, { method: 'PATCH', body: { published }, schema: taleSchema }),
    onSuccess: (tale) => store((tales) => tales.map((t) => (t.id === tale.id ? tale : t))),
  });
}

export function useDeleteTale(target: TaleTarget) {
  const store = useStoreTales(target);
  return useMutation({
    mutationFn: (taleId: string) => api(`${talesPath(target)}/${taleId}`, { method: 'DELETE' }),
    onSuccess: (_, taleId) => store((tales) => tales.filter((t) => t.id !== taleId)),
  });
}
