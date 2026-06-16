/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { Place } from '../models/Place';
import type { Readable } from '../models/Readable';
import type { Tale } from '../models/Tale';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class PlacesService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Obtener todos los lugares de una ciudad (getCityPlaces)
     * Retorna los lugares que pertenecen a una ciudad específica. Soporta filtrado por el query param ?published=true.
     * @param cityId ID de la ciudad a la que pertenecen los lugares
     * @param published Filtrar lugares por estado de publicación (?published=true)
     * @returns any Lista de lugares de la ciudad obtenida correctamente.
     * @throws ApiError
     */
    public getPlacesCity(
        cityId: string,
        published?: 'true' | 'false',
    ): Observable<{
        ok?: boolean;
        count?: number;
        data?: {
            places?: Array<Place>;
        };
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/places/city/{cityId}',
            path: {
                'cityId': cityId,
            },
            query: {
                'published': published,
            },
            errors: {
                404: `No se encontró la ciudad especificada.`,
            },
        });
    }
    /**
     * Crear y guardar un nuevo lugar en una ciudad (savePlace)
     * Inserta un nuevo lugar dentro del array de lugares de la ciudad indicada.
     * @param cityId
     * @param requestBody
     * @returns any Lugar creado y guardado de forma exitosa.
     * @throws ApiError
     */
    public postPlacesCity(
        cityId: string,
        requestBody: {
            name: string;
            userName?: string;
            description?: Readable;
            entry?: Readable;
        },
    ): Observable<{
        ok?: boolean;
        message?: string;
        data?: Place;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/places/city/{cityId}',
            path: {
                'cityId': cityId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `La ciudad especificada no existe.`,
            },
        });
    }
    /**
     * Obtener detalle completo de un solo lugar (getOnePlace)
     * Busca en toda la base de datos y retorna un único lugar por su ID. Devuelve todos los campos desglosados (events como array de IDs, descriptions y entries formateados).
     * @param placeId ID único del lugar a buscar
     * @returns any Detalle del lugar recuperado exitosamente.
     * @throws ApiError
     */
    public getPlaces(
        placeId: string,
    ): Observable<{
        ok?: boolean;
        data?: {
            place?: Place;
        };
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/places/{placeId}',
            path: {
                'placeId': placeId,
            },
            errors: {
                404: `No se encontró el lugar especificado.`,
            },
        });
    }
    /**
     * Eliminar un lugar por completo (deletePlace)
     * Remueve de forma definitiva el subdocumento del lugar sin requerir el ID de la ciudad.
     * @param placeId
     * @returns any Lugar eliminado correctamente.
     * @throws ApiError
     */
    public deletePlaces(
        placeId: string,
    ): Observable<{
        ok?: boolean;
        message?: string;
    }> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/places/{placeId}',
            path: {
                'placeId': placeId,
            },
            errors: {
                404: `Lugar no encontrado.`,
            },
        });
    }
    /**
     * Publicar o despublicar un lugar (publishPlace)
     * Modifica de manera parcial el estado de publicación y setea automáticamente el campo publishDate.
     * @param placeId
     * @param requestBody
     * @returns any Estado de publicación alterado con éxito.
     * @throws ApiError
     */
    public patchPlacesPublish(
        placeId: string,
        requestBody: {
            published: boolean;
        },
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/places/{placeId}/publish',
            path: {
                'placeId': placeId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Añadir un relato de descripción a un lugar (addPlaceDescription)
     * Inserta una nueva descripción en el array del lugar.
     * @param placeId
     * @param requestBody
     * @returns any Descripción guardada.
     * @throws ApiError
     */
    public putPlaces-:placeIdDescription(
        placeId: string,
        requestBody: {
            tale: Readable;
            author: string;
        },
    ): Observable<{
        ok?: boolean;
        data?: {
            description?: Tale;
        };
    }> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/places/:placeId/description',
            path: {
                'placeId': placeId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Actualizar un relato de descripción específico (updatePlaceDescription)
     * Actualiza de forma atómica usando arrayFilters el relato interno del lugar.
     * @param placeId
     * @param requestBody
     * @returns any Descripción actualizada con éxito.
     * @throws ApiError
     */
    public patchPlaces-:placeIdDescription(
        placeId: string,
        requestBody: {
            description: {
                id: string;
                tale: Readable;
                published: boolean;
            };
        },
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/places/:placeId/description',
            path: {
                'placeId': placeId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Eliminar una descripción del lugar (removePlaceDescription)
     * @param placeId
     * @param taleId
     * @returns any Descripción removida del array satisfactoriamente.
     * @throws ApiError
     */
    public deletePlacesDescription(
        placeId: string,
        taleId: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/places/{placeId}/description/{taleId}',
            path: {
                'placeId': placeId,
                'taleId': taleId,
            },
        });
    }
    /**
     * Añadir un cuento de entrada a un lugar (addPlaceEntry)
     * @param placeId
     * @param requestBody
     * @returns any Entrada añadida.
     * @throws ApiError
     */
    public patchPlaces-:placeIdEntry(
        placeId: string,
        requestBody: {
            tale: Readable;
            author: string;
        },
    ): Observable<{
        ok?: boolean;
        data?: {
            entry?: Tale;
        };
    }> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/places/:placeId/entry',
            path: {
                'placeId': placeId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Actualizar un cuento de entrada específico (updatePlaceEntry)
     * @param placeId
     * @param requestBody
     * @returns any Cuento de entrada guardado correctamente.
     * @throws ApiError
     */
    public putPlaces-:placeIdEntry(
        placeId: string,
        requestBody: {
            description: {
                id: string;
                tale: Readable;
                published: boolean;
            };
        },
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/places/:placeId/entry',
            path: {
                'placeId': placeId,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Eliminar un cuento de entrada del lugar (removePlaceEntry)
     * @param placeId
     * @param taleId
     * @returns any Entrada del lugar eliminada con éxito.
     * @throws ApiError
     */
    public deletePlacesEntry(
        placeId: string,
        taleId: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/places/{placeId}/entry/{taleId}',
            path: {
                'placeId': placeId,
                'taleId': taleId,
            },
        });
    }
}
