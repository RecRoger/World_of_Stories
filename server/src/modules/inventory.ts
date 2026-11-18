import { HttpError } from '../lib/http-error.js';
import type { InventoryItem } from '@wos/shared';
import { Item } from '../models/item.model.js';
import type { ICharacter } from '../models/user.model.js';

/*
 * Inventario de un personaje: entradas { itemId, quantity } con objetos del catálogo. Un objeto único se tiene una vez
 * como mucho; uno común (stackable) puede acumularse.
 */

type Inventory = Pick<ICharacter, 'items'>;

/** Cuántos tiene de ese objeto (0 si ninguno) */
export const quantityOf = (character: Inventory, itemId: string) => character.items.find((e) => e.itemId === itemId)?.quantity ?? 0;

/** Suma `quantity` de un objeto (de uno único, como mucho uno) y devuelve cuántos añadió de verdad */
export function addItem(character: Inventory, itemId: string, quantity: number, stackable: boolean): number {
  const entry = character.items.find((e) => e.itemId === itemId);
  const add = stackable ? quantity : entry ? 0 : 1;
  if (!add) return 0;
  if (entry) entry.quantity += add;
  else character.items.push({ itemId, quantity: add });
  return add;
}

/** Quita uno (o `quantity`) de un objeto; si no queda ninguno, sale del inventario */
export function removeItem(character: Inventory, itemId: string, quantity = 1) {
  const index = character.items.findIndex((e) => e.itemId === itemId);
  if (index < 0) return;
  const entry = character.items[index]!;
  if (entry.quantity > quantity) entry.quantity -= quantity;
  else character.items.splice(index, 1);
}

/** El inventario con los datos del catálogo; los objetos que ya no existen en el catálogo no se muestran */
export async function inventoryOf(character: Inventory): Promise<InventoryItem[]> {
  if (!character.items.length) return [];
  const catalog = await Item.find({ _id: { $in: character.items.map((e) => e.itemId) } });
  return character.items.flatMap(({ itemId, quantity }) => {
    const item = catalog.find((i) => i.id === itemId);
    return item ? [{ itemId, name: item.name, description: item.description, stackable: item.stackable, quantity }] : [];
  });
}

/** Los objetos de una decisión o una recompensa tienen que existir en el catálogo */
export async function assertCatalogItems(ids: string[]) {
  const unique = [...new Set(ids)];
  if (!unique.length) return;
  const found = await Item.countDocuments({ _id: { $in: unique } });
  if (found !== unique.length) throw HttpError.badRequest('Algún objeto elegido no existe en el catálogo');
}

/** IDs de objetos que usa una decisión (`item`) o una recompensa, para validarlos */
export const itemsIn = (input: {
  decision?: { decisionType?: string | null; item?: string | null } | null;
  reward?: { type: string; items?: { itemId: string }[] } | null;
}) => [
  ...(input.decision?.decisionType === 'item' && input.decision.item ? [input.decision.item] : []),
  ...(input.reward?.type === 'item' ? (input.reward.items ?? []).map((s) => s.itemId) : []),
];
