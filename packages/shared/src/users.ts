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

export const characterSchema = z
  .object({
    id: objectId,
    name: z.string(),
    location: locationSchema.nullish(),
    whereabouts: whereaboutsSchema.nullish().meta({ description: 'Nombres de su ubicación (null si aún no ha viajado)' }),
    money: z.number(),
    items: z.array(z.string()),
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

/** Por ahora un personaje se distingue por su ubicación: el nombre es opcional */
export const createCharacterInputSchema = z
  .object({ name: z.string().trim().max(40).optional() })
  .meta({ id: 'CreateCharacterInput' });
export type CreateCharacterInput = z.infer<typeof createCharacterInputSchema>;

export const updateCharacterInputSchema = z
  .object({
    name: z.string().trim().min(1).max(40).optional(),
    location: locationInputSchema.nullable().optional(),
    money: z.number().int().min(0).optional(),
    items: z.array(z.string()).optional(),
    animations: z.boolean().optional(),
  })
  .meta({ id: 'UpdateCharacterInput' });
export type UpdateCharacterInput = z.infer<typeof updateCharacterInputSchema>;

export const markReadInputSchema = z.object({ fragmentId: z.string().min(1) }).meta({ id: 'MarkReadInput' });
export type MarkReadInput = z.infer<typeof markReadInputSchema>;
