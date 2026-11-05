import type { QueryKey } from '@tanstack/react-query';
import type { z } from 'zod';
import { citySchema, placeSchema, type Tale } from '@wos/shared';
import type { TaleKind } from './narrative';

/** Lo común a ciudades y lugares en el modo escritor: nombre, publicación, autor y relatos con versiones. */
export type LocationEntity = {
  id: string;
  name: string;
  published: boolean;
  publishDate?: string | null;
  createdBy?: string | null;
} & { [K in TaleKind]?: Tale[] };

/**
 * Describe un tipo de "lugar del mundo" (ciudad o lugar) para que tarjeta, carrusel y mutaciones sean los mismos:
 * dónde vive en la API, en qué listado de la caché está y cómo se nombra en los textos.
 */
export type LocationResource = {
  /** Ruta de una entidad en la API: `/cities/:id` o `/places/:id` (renombrar, publicar, borrar, relatos). */
  path: (id: string) => string;
  /** Listado de la caché que contiene las entidades (se actualiza con cada mutación). */
  listKey: QueryKey;
  schema: z.ZodType<LocationEntity>;
  /** Los dos relatos que tiene, en el orden de las pestañas. */
  kinds: readonly [TaleKind, TaleKind];
  words: {
    /** "Nombre de la ciudad" / "Nombre del lugar" */
    nameLabel: string;
    /** "esta ciudad" / "este lugar" */
    this: string;
    /** "Publicada" / "Publicado" */
    published: string;
  };
};

export const cityResource: LocationResource = {
  path: (id) => `/cities/${id}`,
  listKey: ['cities'],
  schema: citySchema,
  kinds: ['description', 'travel'],
  words: { nameLabel: 'Nombre de la ciudad', this: 'esta ciudad', published: 'Publicada' },
};

export const placesResource = (cityId: string): LocationResource => ({
  path: (id) => `/places/${id}`,
  listKey: ['cities', cityId, 'places'],
  schema: placeSchema,
  kinds: ['description', 'entry'],
  words: { nameLabel: 'Nombre del lugar', this: 'este lugar', published: 'Publicado' },
});
