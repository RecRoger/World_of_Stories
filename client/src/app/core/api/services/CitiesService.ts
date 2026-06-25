/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { City } from '../models/City';
import type { Readable } from '../models/Readable';
import type { Tale } from '../models/Tale';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class CitiesService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Obtener todas las ciudades (Listado Ligero)
     * Retorna todas las ciudades de la base de datos. Excluye automáticamente arrays pesados (description, travel, places) para optimizar el rendimiento de la red.
     * @returns any Listado de ciudades obtenido correctamente.
     * @throws ApiError
     */
    public getCities({
        published,
    }: {
        /**
         * Filtrar por estado de publicación (?published=true o ?published=false)
         */
        published?: boolean,
    }): Observable<{
        ok?: boolean;
        count?: number;
        data?: {
            cities?: Array<City>;
        };
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/cities',
            query: {
                'published': published,
            },
            errors: {
                500: `Error interno del servidor.`,
            },
        });
    }
    /**
     * Crear una nueva ciudad
     * Registra una ciudad en la base de datos con validación de nombre único. Inicializa los relatos de descripción y viaje como borradores.
     * @returns any Ciudad creada exitosamente.
     * @throws ApiError
     */
    public createCity({
        requestBody,
    }: {
        requestBody: {
            name: string;
            username: string;
            description?: Readable;
            travel?: Readable;
        },
    }): Observable<{
        ok?: boolean;
        message?: string;
        data?: {
            city?: City;
        };
    }> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/cities',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                409: `Conflicto: El nombre de la ciudad ya se encuentra registrado.`,
                500: `Error al guardar la ciudad.`,
            },
        });
    }
    /**
     * Obtener el detalle profundo de una ciudad
     * Recupera una ciudad completa por su ID con todos sus arrays hidratados (descriptions, travels, places). Actúa con los virtuals expuestos.
     * @returns any Detalle de la ciudad recuperado con éxito.
     * @throws ApiError
     */
    public getCity({
        id,
    }: {
        /**
         * ID único de MongoDB de la ciudad
         */
        id: string,
    }): Observable<{
        ok?: boolean;
        data?: {
            city?: City;
        };
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/cities/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `No se encontró la ciudad especificada.`,
            },
        });
    }
    /**
     * Cambiar estado de publicación de una ciudad
     * Publica o despublica una ciudad calculando de forma automática la fecha de publicación.
     * @returns any Estado de publicación actualizado correctamente.
     * @throws ApiError
     */
    public updateCity({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: {
            name: string;
            username?: string;
        },
    }): Observable<{
        ok?: boolean;
        message?: string;
        data?: {
            city?: City;
        };
    }> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/cities/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Ciudad no encontrada.`,
            },
        });
    }
    /**
     * Eliminar una ciudad por completo
     * Remueve de forma permanente el documento de la ciudad y todos los subdocumentos anidados (relatos y lugares).
     * @returns any Ciudad eliminada.
     * @throws ApiError
     */
    public deleteCity({
        id,
    }: {
        /**
         * ID de la ciudad a destruir
         */
        id: string,
    }): Observable<{
        ok?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/cities/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `No se encontró la ciudad para eliminar.`,
            },
        });
    }
    /**
     * Cambiar estado de publicación de una ciudad
     * Publica o despublica una ciudad calculando de forma automática la fecha de publicación.
     * @returns any Estado de publicación actualizado correctamente.
     * @throws ApiError
     */
    public publishCity({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: {
            published: boolean;
        },
    }): Observable<{
        ok?: boolean;
        message?: string;
        data?: {
            city?: City;
        };
    }> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/cities/{id}/publish',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Ciudad no encontrada.`,
            },
        });
    }
    /**
     * Añadir una descripción al array de la ciudad
     * @returns any Relato añadido.
     * @throws ApiError
     */
    public addCityDescription({
        cityId,
        requestBody,
    }: {
        cityId: string,
        requestBody: {
            tale: Readable;
            author: string;
        },
    }): Observable<{
        ok?: boolean;
        message?: string;
        data?: {
            description?: Tale;
        };
    }> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/cities/{cityId}/description',
            path: {
                'cityId': cityId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Actualizar un relato de descripción existente
     * @returns any Descripción actualizada de forma atómica.
     * @throws ApiError
     */
    public updateCityDescription({
        cityId,
        requestBody,
    }: {
        cityId: string,
        requestBody: {
            description: {
                id: string;
                tale: Readable;
                published: boolean;
            };
        },
    }): Observable<{
        ok?: boolean;
        data?: {
            description?: Tale;
        };
    }> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/cities/{cityId}/description',
            path: {
                'cityId': cityId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Eliminar una descripción del array
     * @returns any Relato removido usando $pull.
     * @throws ApiError
     */
    public removeCityDescription({
        cityId,
        taleId,
    }: {
        cityId: string,
        taleId: string,
    }): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/cities/{cityId}/description/{taleId}',
            path: {
                'cityId': cityId,
                'taleId': taleId,
            },
        });
    }
    /**
     * Añadir un viaje al array de la ciudad
     * @returns any Viaje añadido con éxito.
     * @throws ApiError
     */
    public addCityTravel({
        cityId,
        requestBody,
    }: {
        cityId: string,
        requestBody: {
            tale: Readable;
            author: string;
        },
    }): Observable<{
        ok?: boolean;
        data?: {
            travel?: Tale;
        };
    }> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/cities/{cityId}/travel',
            path: {
                'cityId': cityId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Actualizar un relato de viaje existente
     * @returns any Viaje actualizado.
     * @throws ApiError
     */
    public updateCityTravel({
        cityId,
        requestBody,
    }: {
        cityId: string,
        requestBody: {
            description: {
                id: string;
                tale: Readable;
                published: boolean;
            };
        },
    }): Observable<{
        ok?: boolean;
        data?: {
            travel?: Tale;
        };
    }> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/cities/{cityId}/travel',
            path: {
                'cityId': cityId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Eliminar un viaje del array
     * @returns any Relato de viaje eliminado.
     * @throws ApiError
     */
    public removeCityTravel({
        cityId,
        taleId,
    }: {
        cityId: string,
        taleId: string,
    }): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/cities/{cityId}/travel/{taleId}',
            path: {
                'cityId': cityId,
                'taleId': taleId,
            },
        });
    }
}
