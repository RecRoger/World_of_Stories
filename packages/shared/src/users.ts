import { z } from 'zod';
import { isoDate, objectId } from './common.js';

export const ROLES = ['Reader', 'Writer', 'Admin'] as const;
export const roleSchema = z.enum(ROLES);
export type Role = z.infer<typeof roleSchema>;

const username = z
  .string()
  .trim()
  .min(3, 'Mínimo 3 caracteres')
  .max(30, 'Máximo 30 caracteres')
  .regex(/^[\p{L}\d_.-]+$/u, 'Solo letras, números, "_", "." y "-"');
const email = z.email('Email inválido').trim().toLowerCase();
const password = z.string().min(8, 'Mínimo 8 caracteres').max(128);

export const locationSchema = z
  .object({
    cityId: z.string(),
    placeId: z.string().nullish(),
    npcId: z.string().nullish(),
    chapterId: z.string().nullish(),
  })
  .meta({ id: 'Location' });
export type Location = z.infer<typeof locationSchema>;

export const locationInputSchema = z
  .object({
    cityId: objectId,
    placeId: objectId.optional(),
    npcId: objectId.optional(),
    chapterId: objectId.optional(),
  })
  .meta({ id: 'LocationInput' });

export const WHEREABOUTS_KINDS = ['city', 'place', 'npc', 'chapter'] as const;

/** Nombres de dónde está un personaje, para listarlo sin cargar cada ciudad, lugar, NPC o capítulo */
export const whereaboutsSchema = z
  .object({
    kind: z.enum(WHEREABOUTS_KINDS).meta({ description: 'Lo más concreto de su ubicación' }),
    city: z.string().nullish(),
    place: z.string().nullish(),
    npc: z.string().nullish(),
    chapter: z.string().nullish(),
  })
  .meta({ id: 'Whereabouts' });
export type Whereabouts = z.infer<typeof whereaboutsSchema>;

/** Un objeto del inventario: del catálogo, con su nombre y descripción, y cuántos tiene */
export const inventoryItemSchema = z
  .object({
    itemId: objectId,
    name: z.string(),
    description: z.string(),
    stackable: z.boolean().meta({ description: 'Elemento común (puede tener varios) u objeto único' }),
    quantity: z.number(),
  })
  .meta({ id: 'InventoryItem' });
export type InventoryItem = z.infer<typeof inventoryItemSchema>;

export const characterSchema = z
  .object({
    id: objectId,
    location: locationSchema.nullish(),
    whereabouts: whereaboutsSchema.nullish().meta({ description: 'Nombres de su ubicación (null si aún no ha viajado)' }),
    money: z.number(),
    items: z.array(inventoryItemSchema).meta({ description: 'Inventario: objetos del catálogo con su cantidad' }),
    fragmentsRead: z.array(z.string()),
    animations: z.boolean(),
  })
  .meta({ id: 'Character' });
export type Character = z.infer<typeof characterSchema>;

export const userSchema = z
  .object({
    id: objectId,
    email: z.string(),
    username: z.string(),
    roles: z.array(roleSchema),
    createdAt: isoDate.optional(),
    updatedAt: isoDate.optional(),
  })
  .meta({ id: 'User' });
export type User = z.infer<typeof userSchema>;

export const registerInputSchema = z.object({ email, username, password }).meta({ id: 'RegisterInput' });
export type RegisterInput = z.infer<typeof registerInputSchema>;

export const loginInputSchema = z
  .object({
    identifier: z.string().trim().min(1).meta({ description: 'Username o email' }),
    password: z.string().min(1),
  })
  .meta({ id: 'LoginInput' });
export type LoginInput = z.infer<typeof loginInputSchema>;

export const updateMeInputSchema = z
  .object({
    email: email.optional(),
    username: username.optional(),
    password: password.optional(),
    currentPassword: z.string().min(1).meta({ description: 'Obligatoria para cambiar email o contraseña' }).optional(),
  })
  .meta({ id: 'UpdateMeInput' });
export type UpdateMeInput = z.infer<typeof updateMeInputSchema>;

export const becomeWriterInputSchema = z
  .object({ code: z.string().min(1).meta({ description: 'Código de invitación de escritores' }) })
  .meta({ id: 'BecomeWriterInput' });
export type BecomeWriterInput = z.infer<typeof becomeWriterInputSchema>;

export const setRolesInputSchema = z
  .object({ roles: z.array(roleSchema).min(1) })
  .meta({ id: 'SetRolesInput' });
export type SetRolesInput = z.infer<typeof setRolesInputSchema>;

export const updateCharacterInputSchema = z
  .object({
    location: locationInputSchema.nullable().optional(),
    animations: z.boolean().optional(),
  })
  .meta({ id: 'UpdateCharacterInput' });
export type UpdateCharacterInput = z.infer<typeof updateCharacterInputSchema>;

/**
 * Elegir la opción que cuesta algo en una decisión: la de pago de una decisión `money` (descuenta el monto) o la que
 * usa un objeto en una decisión `item` (hay que tenerlo; se gasta si la opción tiene `removeItem`). Lleva al capítulo
 * de esa opción.
 */
export const payInputSchema = z
  .object({
    npcId: objectId,
    chapterId: objectId.optional().meta({ description: 'Capítulo de la decisión; si se omite, es la del encuentro del NPC' }),
    optionId: objectId,
  })
  .meta({ id: 'PayInput' });
export type PayInput = z.infer<typeof payInputSchema>;

/** Cobrar la recompensa del capítulo donde está el personaje, al terminar de leerlo */
export const claimRewardInputSchema = z.object({ chapterId: objectId }).meta({ id: 'ClaimRewardInput' });
export type ClaimRewardInput = z.infer<typeof claimRewardInputSchema>;

export const markReadInputSchema = z.object({ fragmentId: z.string().min(1) }).meta({ id: 'MarkReadInput' });
export type MarkReadInput = z.infer<typeof markReadInputSchema>;

/** Resultado de cobrar una recompensa: el personaje actualizado y lo que ganó de verdad (puede ser nada) */
export const claimRewardResultSchema = z
  .object({
    character: characterSchema,
    gained: z.object({
      money: z.number().meta({ description: 'Monedas ganadas (0 si no tocaba)' }),
      items: z
        .array(z.object({ itemId: objectId, name: z.string(), quantity: z.number() }))
        .meta({ description: 'Objetos ganados y cuántos (los únicos que ya tenía no cuentan)' }),
    }),
  })
  .meta({ id: 'ClaimRewardResult' });
export type ClaimRewardResult = z.infer<typeof claimRewardResultSchema>;
