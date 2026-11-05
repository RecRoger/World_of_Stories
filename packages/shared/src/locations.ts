import { z } from 'zod';
import { isoDate, narrativeSchema, objectId, taleSchema } from './common.js';

const name = z.string().trim().min(1, 'El nombre es obligatorio').max(80);

/*
 * Dos representaciones de ciudades y lugares:
 * - Completa (City, Place): todas las versiones de cada relato, borradores incluidos. Es la del modo escritor.
 * - De lectura (CityReading, PlaceReading): solo lo publicado, con UNA versión de cada relato elegida al azar.
 */

const randomVersion = (what: string) =>
  taleSchema.nullable().meta({ description: `Una versión publicada de ${what}, elegida al azar en cada petición (null si no hay)` });

export const citySchema = z
  .object({
    id: objectId,
    name: z.string(),
    published: z.boolean(),
    publishDate: isoDate.nullish(),
    description: z.array(taleSchema),
    travel: z.array(taleSchema),
    createdBy: z.string().nullish(),
    createdAt: isoDate.optional(),
    updatedAt: isoDate.optional(),
  })
  .meta({ id: 'City' });
export type City = z.infer<typeof citySchema>;

export const cityReadingSchema = z
  .object({
    id: objectId,
    name: z.string(),
    publishDate: isoDate.nullish(),
    description: randomVersion('la descripción'),
    travel: randomVersion('el viaje'),
  })
  .meta({ id: 'CityReading' });
export type CityReading = z.infer<typeof cityReadingSchema>;

export const createCityInputSchema = z
  .object({ name, description: narrativeSchema, travel: narrativeSchema })
  .meta({ id: 'CreateCityInput' });
export type CreateCityInput = z.infer<typeof createCityInputSchema>;

export const updateCityInputSchema = z.object({ name }).meta({ id: 'UpdateCityInput' });
export type UpdateCityInput = z.infer<typeof updateCityInputSchema>;

export const placeSchema = z
  .object({
    id: objectId,
    cityId: objectId,
    name: z.string(),
    published: z.boolean(),
    publishDate: isoDate.nullish(),
    description: z.array(taleSchema),
    entry: z.array(taleSchema),
    npcIds: z.array(objectId),
    createdBy: z.string().nullish(),
  })
  .meta({ id: 'Place' });
export type Place = z.infer<typeof placeSchema>;

export const placeReadingSchema = z
  .object({
    id: objectId,
    cityId: objectId,
    name: z.string(),
    publishDate: isoDate.nullish(),
    description: randomVersion('la descripción'),
    entry: randomVersion('la entrada'),
  })
  .meta({ id: 'PlaceReading' });
export type PlaceReading = z.infer<typeof placeReadingSchema>;

export const createPlaceInputSchema = z
  .object({ name, description: narrativeSchema, entry: narrativeSchema })
  .meta({ id: 'CreatePlaceInput' });
export type CreatePlaceInput = z.infer<typeof createPlaceInputSchema>;

export const updatePlaceInputSchema = z.object({ name }).meta({ id: 'UpdatePlaceInput' });
export type UpdatePlaceInput = z.infer<typeof updatePlaceInputSchema>;
