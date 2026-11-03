import { z } from 'zod';
import {
  createPlaceInputSchema,
  objectId,
  placeSchema,
  placeSummarySchema,
  publishedQuerySchema,
  publishInputSchema,
  updatePlaceInputSchema,
  type Place as PlaceDto,
  type PlaceSummary,
} from '@wos/shared';
import { ApiRouter, isWriter, type AuthUser } from '../lib/route.js';
import { HttpError, found } from '../lib/http-error.js';
import { City, type CityDoc, type PlaceDoc } from '../models/city.model.js';
import { Npc } from '../models/npc.model.js';
import { assertCanDelete, assertCanEdit, setPublished } from './permissions.js';
import { registerTaleRoutes, visibleTales } from './tales.js';
import { loadCity } from './cities.routes.js';

/** Rutas anidadas bajo la ciudad: /cities/:cityId/places */
export const cityPlacesApi = new ApiRouter('/cities', 'Lugares');
export const placesApi = new ApiRouter('/places', 'Lugares');

const cityParams = z.object({ cityId: objectId });
const placeParams = z.object({ placeId: objectId });

/** Carga un lugar y su ciudad; los lectores no ven lugares (ni ciudades) sin publicar */
export async function loadPlace(placeId: string, user?: AuthUser): Promise<{ city: CityDoc; place: PlaceDoc }> {
  const city = await City.findOne({ 'places._id': placeId });
  const place = city?.places.id(placeId);
  if (!city || !place || !(isWriter(user) || (city.published && place.published))) {
    throw HttpError.notFound('Lugar no encontrado');
  }
  return { city, place };
}

const toSummary = (city: CityDoc, p: PlaceDoc): PlaceSummary => ({
  id: p.id,
  cityId: city.id,
  name: p.name,
  published: p.published,
  publishDate: p.publishDate?.toISOString() ?? null,
});

function toDto(city: CityDoc, place: PlaceDoc, user?: AuthUser): PlaceDto {
  const json = place.toJSON() as unknown as Omit<PlaceDto, 'cityId'>;
  const drafts = isWriter(user);
  return {
    ...json,
    cityId: city.id,
    description: visibleTales(json.description, drafts),
    entry: visibleTales(json.entry, drafts),
  };
}

cityPlacesApi
  .route(
    {
      method: 'get',
      path: '/:cityId/places',
      summary: 'Listar lugares de una ciudad',
      params: cityParams,
      query: publishedQuerySchema,
      response: z.array(placeSummarySchema),
    },
    async ({ params, query, user }) => {
      const city = await loadCity(params.cityId, user);
      const published = isWriter(user) ? query.published : true;
      return city.places.filter((p) => published === undefined || p.published === published).map((p) => toSummary(city, p));
    },
  )
  .route(
    {
      method: 'post',
      path: '/:cityId/places',
      summary: 'Crear lugar en una ciudad',
      access: 'writer',
      params: cityParams,
      body: createPlaceInputSchema,
      response: placeSchema,
      status: 201,
    },
    async ({ params, body, user }) => {
      const city = await loadCity(params.cityId, user);
      const firstVersion = (tale: typeof body.description) => [{ tale, author: user.username, published: false }];
      city.places.push({
        name: body.name,
        description: firstVersion(body.description),
        entry: firstVersion(body.entry),
        events: [],
        createdBy: user.username,
      });
      await city.save();
      return toDto(city, city.places.at(-1)!, user);
    },
  );

placesApi
  .route(
    { method: 'get', path: '/:placeId', summary: 'Ver lugar', params: placeParams, response: placeSchema },
    async ({ params, user }) => {
      const { city, place } = await loadPlace(params.placeId, user);
      return toDto(city, place, user);
    },
  )
  .route(
    {
      method: 'patch',
      path: '/:placeId',
      summary: 'Renombrar lugar',
      access: 'writer',
      params: placeParams,
      body: updatePlaceInputSchema,
      response: placeSchema,
    },
    async ({ params, body, user }) => {
      const { city, place } = await loadPlace(params.placeId, user);
      assertCanEdit(user, place.createdBy);
      place.name = body.name;
      await city.save();
      return toDto(city, place, user);
    },
  )
  .route(
    {
      method: 'patch',
      path: '/:placeId/publish',
      summary: 'Publicar o despublicar lugar',
      access: 'writer',
      params: placeParams,
      body: publishInputSchema,
      response: placeSchema,
    },
    async ({ params, body, user }) => {
      const { city, place } = await loadPlace(params.placeId, user);
      assertCanEdit(user, place.createdBy);
      setPublished(place, body.published);
      await city.save();
      return toDto(city, place, user);
    },
  )
  .route(
    { method: 'delete', path: '/:placeId', summary: 'Borrar lugar y sus NPCs', access: 'writer', params: placeParams },
    async ({ params, user }) => {
      const { city, place } = await loadPlace(params.placeId, user);
      assertCanDelete(user, place.createdBy);
      await Npc.deleteMany({ _id: { $in: place.events } });
      place.deleteOne();
      await city.save();
    },
  );

for (const kind of ['description', 'entry'] as const) {
  registerTaleRoutes(placesApi, {
    path: `/:placeId/${kind}`,
    params: placeParams,
    label: kind === 'description' ? 'la descripción del lugar' : 'la entrada al lugar',
    load: async ({ placeId }) => {
      const city = found(await City.findOne({ 'places._id': placeId }), 'Lugar no encontrado');
      const place = found(city.places.id(placeId), 'Lugar no encontrado');
      return { root: city, list: place[kind] };
    },
  });
}
