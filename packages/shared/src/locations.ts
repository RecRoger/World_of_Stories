import { z } from 'zod';
import { isoDate, narrativeSchema, objectId, taleSchema } from './common.js';

const name = z.string().trim().min(1, 'El nombre es obligatorio').max(80);

export const citySummarySchema = z
  .object({
    id: objectId,
    name: z.string(),
    published: z.boolean(),
    publishDate: isoDate.nullish(),
  })
  .meta({ id: 'CitySummary' });
export type CitySummary = z.infer<typeof citySummarySchema>;

export const citySchema = citySummarySchema
  .extend({
    description: z.array(taleSchema),
    travel: z.array(taleSchema),
    createdBy: z.string().optional(),
    createdAt: isoDate.optional(),
    updatedAt: isoDate.optional(),
  })
  .meta({ id: 'City' });
export type City = z.infer<typeof citySchema>;

export const createCityInputSchema = z
  .object({ name, description: narrativeSchema, travel: narrativeSchema })
  .meta({ id: 'CreateCityInput' });
export type CreateCityInput = z.infer<typeof createCityInputSchema>;

export const updateCityInputSchema = z.object({ name }).meta({ id: 'UpdateCityInput' });
export type UpdateCityInput = z.infer<typeof updateCityInputSchema>;

export const placeSummarySchema = z
  .object({
    id: objectId,
    cityId: objectId,
    name: z.string(),
    published: z.boolean(),
    publishDate: isoDate.nullish(),
  })
  .meta({ id: 'PlaceSummary' });
export type PlaceSummary = z.infer<typeof placeSummarySchema>;

export const placeSchema = placeSummarySchema
  .extend({
    description: z.array(taleSchema),
    entry: z.array(taleSchema),
    npcIds: z.array(objectId),
    createdBy: z.string().optional(),
  })
  .meta({ id: 'Place' });
export type Place = z.infer<typeof placeSchema>;

export const createPlaceInputSchema = z
  .object({ name, description: narrativeSchema, entry: narrativeSchema })
  .meta({ id: 'CreatePlaceInput' });
export type CreatePlaceInput = z.infer<typeof createPlaceInputSchema>;

export const updatePlaceInputSchema = z.object({ name }).meta({ id: 'UpdatePlaceInput' });
export type UpdatePlaceInput = z.infer<typeof updatePlaceInputSchema>;
