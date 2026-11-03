import { z } from 'zod';
import {
  citySchema,
  citySummarySchema,
  createCityInputSchema,
  objectId,
  publishedQuerySchema,
  publishInputSchema,
  updateCityInputSchema,
  type City as CityDto,
  type CitySummary,
} from '@wos/shared';
import { ApiRouter, isWriter, type AuthUser } from '../lib/route.js';
import { found } from '../lib/http-error.js';
import { City, type CityDoc } from '../models/city.model.js';
import { Npc } from '../models/npc.model.js';
import { assertCanDelete, assertCanEdit, setPublished } from './permissions.js';
import { registerTaleRoutes, visibleTales } from './tales.js';

export const citiesApi = new ApiRouter('/cities', 'Ciudades');

const cityParams = z.object({ cityId: objectId });

/** Carga una ciudad; los lectores no ven ciudades sin publicar */
export async function loadCity(cityId: string, user?: AuthUser): Promise<CityDoc> {
  const city = await City.findById(cityId);
  return found(city && (city.published || isWriter(user)) ? city : null, 'Ciudad no encontrada');
}

const toSummary = (c: CityDoc): CitySummary => ({
  id: c.id,
  name: c.name,
  published: c.published,
  publishDate: c.publishDate?.toISOString() ?? null,
});

function toDto(city: CityDoc, user?: AuthUser): CityDto {
  const { places: _places, ...json } = city.toJSON() as unknown as CityDto & { places?: unknown };
  const drafts = isWriter(user);
  return { ...json, description: visibleTales(json.description, drafts), travel: visibleTales(json.travel, drafts) };
}

citiesApi
  .route(
    {
      method: 'get',
      path: '/',
      summary: 'Listar ciudades',
      description: 'Los lectores solo reciben ciudades publicadas; los escritores pueden filtrar con `published`.',
      query: publishedQuerySchema,
      response: z.array(citySummarySchema),
    },
    async ({ query, user }) => {
      const published = isWriter(user) ? query.published : true;
      const cities = await City.find(published === undefined ? {} : { published }, 'name published publishDate').sort({ name: 1 });
      return cities.map(toSummary);
    },
  )
  .route(
    {
      method: 'post',
      path: '/',
      summary: 'Crear ciudad',
      access: 'writer',
      body: createCityInputSchema,
      response: citySchema,
      status: 201,
    },
    async ({ body, user }) => {
      const firstVersion = (tale: typeof body.description) => [{ tale, author: user.username, published: false }];
      const city = await City.create({
        name: body.name,
        description: firstVersion(body.description),
        travel: firstVersion(body.travel),
        createdBy: user.username,
      });
      return toDto(city, user);
    },
  )
  .route(
    { method: 'get', path: '/:cityId', summary: 'Ver ciudad (sin lugares)', params: cityParams, response: citySchema },
    async ({ params, user }) => toDto(await loadCity(params.cityId, user), user),
  )
  .route(
    {
      method: 'patch',
      path: '/:cityId',
      summary: 'Renombrar ciudad',
      access: 'writer',
      params: cityParams,
      body: updateCityInputSchema,
      response: citySchema,
    },
    async ({ params, body, user }) => {
      const city = await loadCity(params.cityId, user);
      assertCanEdit(user, city.createdBy);
      city.name = body.name;
      await city.save();
      return toDto(city, user);
    },
  )
  .route(
    {
      method: 'patch',
      path: '/:cityId/publish',
      summary: 'Publicar o despublicar ciudad',
      access: 'writer',
      params: cityParams,
      body: publishInputSchema,
      response: citySchema,
    },
    async ({ params, body, user }) => {
      const city = await loadCity(params.cityId, user);
      assertCanEdit(user, city.createdBy);
      setPublished(city, body.published);
      await city.save();
      return toDto(city, user);
    },
  )
  .route(
    {
      method: 'delete',
      path: '/:cityId',
      summary: 'Borrar ciudad con sus lugares y NPCs',
      access: 'writer',
      params: cityParams,
    },
    async ({ params, user }) => {
      const city = await loadCity(params.cityId, user);
      assertCanDelete(user, city.createdBy);
      const npcIds = city.places.flatMap((p) => p.events);
      await Npc.deleteMany({ _id: { $in: npcIds } });
      await city.deleteOne();
    },
  );

for (const kind of ['description', 'travel'] as const) {
  registerTaleRoutes(citiesApi, {
    path: `/:cityId/${kind}`,
    params: cityParams,
    label: kind === 'description' ? 'la descripción de la ciudad' : 'el viaje a la ciudad',
    load: async ({ cityId }) => {
      const city = found(await City.findById(cityId), 'Ciudad no encontrada');
      return { root: city, list: city[kind] };
    },
  });
}
