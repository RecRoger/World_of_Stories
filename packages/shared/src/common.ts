import { z } from 'zod';

export const objectId = z
  .string()
  .regex(/^[a-f\d]{24}$/i, 'ID inválido')
  .meta({ description: 'ObjectId de MongoDB', example: '64b7f0c2a1b2c3d4e5f60718' });

export const isoDate = z.string().meta({ format: 'date-time' });

export const ANIMATIONS = ['default', 'chatA', 'chatB', 'surprise', 'title'] as const;

/*
 * Convención: los esquemas *Input* validan lo que envía el cliente (estrictos);
 * los de respuesta describen lo guardado, que incluye datos antiguos menos uniformes.
 */

/** Un fragmento de narrativa con su animación de presentación */
export const readableSchema = z
  .object({
    text: z.string(),
    animation: z.string().nullish().meta({ description: `Normalmente uno de: ${ANIMATIONS.join(', ')}` }),
  })
  .meta({ id: 'Readable' });
export type Readable = z.infer<typeof readableSchema>;

export const readableInputSchema = z
  .object({
    text: z.string().trim().min(1, 'El texto no puede estar vacío').max(5000),
    animation: z.enum(ANIMATIONS).optional(),
  })
  .meta({ id: 'ReadableInput' });
export type ReadableInput = z.infer<typeof readableInputSchema>;

export const narrativeSchema = z.array(readableInputSchema).min(1, 'Se necesita al menos un fragmento').max(200);

/** Versión de un relato escrita por un autor (descripción, viaje, entrada...) */
export const taleSchema = z
  .object({
    id: objectId,
    tale: z.array(readableSchema),
    author: z.string(),
    published: z.boolean(),
    writeDate: isoDate.optional(),
    publishDate: isoDate.nullish(),
  })
  .meta({ id: 'Tale' });
export type Tale = z.infer<typeof taleSchema>;

export const taleInputSchema = z.object({ tale: narrativeSchema }).meta({ id: 'TaleInput' });
export type TaleInput = z.infer<typeof taleInputSchema>;

export const publishInputSchema = z.object({ published: z.boolean() }).meta({ id: 'PublishInput' });
export type PublishInput = z.infer<typeof publishInputSchema>;

/** `?published=true|false`; solo tiene efecto para escritores (los lectores siempre ven lo publicado) */
export const publishedQuerySchema = z.object({
  published: z
    .enum(['true', 'false'])
    .transform((v) => v === 'true')
    .optional(),
});

export const messageSchema = z.object({ message: z.string() }).meta({ id: 'Message' });

export const apiErrorSchema = z
  .object({
    error: z.object({
      code: z.string(),
      message: z.string(),
      details: z.unknown().optional(),
    }),
  })
  .meta({ id: 'ApiError' });
export type ApiError = z.infer<typeof apiErrorSchema>;
