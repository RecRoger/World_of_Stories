/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { Npc } from '../models/Npc';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class NpCsService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Obtener todos los NPCs de un lugar
     * @param placeId ID del lugar geográfico
     * @param published Filtrar por estado de publicación (?published=true)
     * @returns any Listado de NPCs obtenido con éxito
     * @throws ApiError
     */
    public getNpcsPlace(
        placeId: string,
        published?: boolean,
    ): Observable<{
        ok?: boolean;
        data?: {
            npcs?: Array<Npc>;
        };
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/npcs/place/{placeId}',
            path: {
                'placeId': placeId,
            },
            query: {
                'published': published,
            },
            errors: {
                404: `No se encontró la ciudad o el lugar especificado.`,
            },
        });
    }
    /**
     * Crear un nuevo NPC y asociarlo al lugar
     * @param placeId
     * @param requestBody
     * @returns any NPC creado y vinculado exitosamente
     * @throws ApiError
     */
    public postNpcsPlace(
        placeId: string,
        requestBody: {
            npc?: {
                name: string;
                title?: string;
                npcType?: string;
                description?: string;
                meeting?: string;
                rejected?: string;
                author: string;
            };
        },
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'POST',
            url: '/npcs/place/{placeId}',
            path: {
                'placeId': placeId,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Faltan los datos del NPC en el cuerpo de la petición.`,
                404: `No se pudo asociar el NPC porque el lugar no existe.`,
            },
        });
    }
    /**
     * Eliminar un NPC de forma global
     * Borra el NPC y remueve automáticamente su ID de cualquier lista de eventos asociados en ciudades.
     * @param npcId
     * @returns any NPC eliminado y desvinculado de su lugar de origen correctamente.
     * @throws ApiError
     */
    public deleteNpcs(
        npcId: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/npcs/{id}',
            path: {
                'npcId': npcId,
            },
            errors: {
                404: `El NPC que intentas eliminar no existe.`,
            },
        });
    }
    /**
     * Obtener un NPC por ID
     * @param id
     * @returns any Detalle del NPC devuelto con éxito
     * @throws ApiError
     */
    public getNpcs(
        id: string,
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/npcs/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `NPC no encontrado o no publicado.`,
            },
        });
    }
    /**
     * Actualizar propiedades de un NPC
     * @param id
     * @param requestBody
     * @throws ApiError
     */
    public putNpcs(
        id: string,
        requestBody: {
            npc?: {
                name?: string;
                title?: string;
                items?: Array<string>;
            };
        },
    ): Observable<void> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/npcs/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
    /**
     * Publicar o despublicar un NPC de forma parcial
     * @param id
     * @param requestBody
     * @returns any Estado de publicación actualizado con éxito.
     * @throws ApiError
     */
    public patchNpcsPublish(
        id: string,
        requestBody: {
            published?: boolean;
        },
    ): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/npcs/{id}/publish',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
        });
    }
}
