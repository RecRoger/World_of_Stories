import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { z } from 'zod';
import { itemSchema, type CreateItemInput, type Item, type UpdateItemInput } from '@wos/shared';
import { api } from '@/lib/api';

export const itemsQueryKey = ['items'] as const;

/** Catálogo de objetos (modo escritor), ordenado por nombre */
export function useItems(enabled = true) {
  return useQuery({
    queryKey: itemsQueryKey,
    queryFn: ({ signal }) => api('/items', { schema: z.array(itemSchema), signal }),
    enabled,
  });
}

const byName = (a: Item, b: Item) => a.name.localeCompare(b.name, 'es', { sensitivity: 'base' });

function useStoreItem() {
  const queryClient = useQueryClient();
  return (item: Item) =>
    queryClient.setQueryData<Item[]>(
      itemsQueryKey,
      (list) =>
        list &&
        (list.some((i) => i.id === item.id) ? list.map((i) => (i.id === item.id ? item : i)) : [...list, item]).sort(byName),
    );
}

export function useCreateItem() {
  const store = useStoreItem();
  return useMutation({
    mutationFn: (body: CreateItemInput) => api('/items', { method: 'POST', body, schema: itemSchema }),
    onSuccess: store,
  });
}

/** Editar y borrar: solo su autor o un admin (el server lo comprueba) */
export function useUpdateItem() {
  const store = useStoreItem();
  return useMutation({
    mutationFn: ({ id, body }: { id: string; body: UpdateItemInput }) =>
      api(`/items/${id}`, { method: 'PATCH', body, schema: itemSchema }),
    onSuccess: store,
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api(`/items/${id}`, { method: 'DELETE' }),
    onSuccess: (_, id) => queryClient.setQueryData<Item[]>(itemsQueryKey, (list) => list?.filter((i) => i.id !== id)),
  });
}
