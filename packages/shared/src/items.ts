import { z } from 'zod';
import { isoDate, objectId } from './common.js';

/** Objeto del catálogo: lo que un personaje puede guardar en su inventario (los nombres son únicos) */
export const itemSchema = z
  .object({
    id: objectId,
    name: z.string(),
    description: z.string().meta({ description: 'Descripción opcional ("" si no tiene)' }),
    price: z.number().meta({ description: 'Precio en monedas' }),
    stackable: z.boolean().meta({ description: 'true: elemento común (se puede tener varias veces); false: objeto único' }),
    author: z.string(),
    createdAt: isoDate.optional(),
    updatedAt: isoDate.optional(),
  })
  .meta({ id: 'Item' });
export type Item = z.infer<typeof itemSchema>;

export const createItemInputSchema = z
  .object({
    name: z.string().trim().min(1, 'El nombre es obligatorio').max(80, 'Máximo 80 caracteres'),
    description: z.string().trim().max(300, 'Máximo 300 caracteres').optional().meta({ description: 'Vacía la quita' }),
    price: z.number().int('Un número entero de monedas').min(0, 'No puede ser negativo').max(1_000_000),
    stackable: z.boolean().optional().meta({ description: 'Por defecto false (objeto único)' }),
  })
  .meta({ id: 'CreateItemInput' });
export type CreateItemInput = z.infer<typeof createItemInputSchema>;

export const updateItemInputSchema = createItemInputSchema.partial().meta({ id: 'UpdateItemInput' });
export type UpdateItemInput = z.infer<typeof updateItemInputSchema>;
