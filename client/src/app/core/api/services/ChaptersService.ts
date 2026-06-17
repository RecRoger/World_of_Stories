/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import type { Observable } from 'rxjs';
import type { Chapter } from '../models/Chapter';
import type { UsersDecisions } from '../models/UsersDecisions';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';
@Injectable({
    providedIn: 'root',
})
export class ChaptersService {
    constructor(public readonly http: HttpClient) {}
    /**
     * Obtener el listado simplificado de capítulos de un NPC
     * @returns any Estructura de capítulos obtenida
     * @throws ApiError
     */
    public getNpcChapters({
        npcId,
        published,
    }: {
        /**
         * ID del NPC dueño de la historia
         */
        npcId: string,
        /**
         * Filtrar por estado publicado
         */
        published?: boolean,
    }): Observable<{
        ok?: boolean;
        data?: {
            chapters?: Array<{
                id?: string;
                name?: string;
                published?: boolean;
            }>;
        };
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/chapters/npc/{npcId}',
            path: {
                'npcId': npcId,
            },
            query: {
                'published': published,
            },
        });
    }
    /**
     * Obtener el detalle profundo de un capítulo por su ID propio
     * @returns any Datos del capítulo (incluyendo opciones e IDs de grafo)
     * @throws ApiError
     */
    public gteChapter({
        id,
    }: {
        /**
         * ID único del capítulo
         */
        id: string,
    }): Observable<{
        ok?: boolean;
        data?: {
            chapter?: Chapter;
        };
    }> {
        return __request(OpenAPI, this.http, {
            method: 'GET',
            url: '/chapters/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `Capítulo no encontrado dentro del árbol del NPC.`,
            },
        });
    }
    /**
     * Actualizar un capítulo o inyectar nuevas decisiones en caliente
     * Permite modificar la narración de la historia. Si envías opciones dentro de `usersDecisions.options` sin propiedad `value`, el sistema creará pre-capítulos hijos de forma dinámica en la base de datos.
     * @returns any Capítulo y ramificaciones modificados correctamente.
     * @throws ApiError
     */
    public updateChapters({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: {
            chapter?: {
                name?: string;
                story?: Array<string>;
                author?: string;
                usersDecisions?: UsersDecisions;
            };
        },
    }): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'PUT',
            url: '/chapters/{id}',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `No se encontró el capítulo solicitado para actualizar.`,
            },
        });
    }
    /**
     * Eliminar un capítulo y limpiar referencias de decisiones huérfanas
     * Elimina el subdocumento del capítulo y ejecuta una limpieza atómica en cascada quitando cualquier opción de otros capítulos que apuntara a este ID.
     * @returns any Capítulo eliminado y referencias desvinculadas con éxito.
     * @throws ApiError
     */
    public deleteChapters({
        id,
    }: {
        id: string,
    }): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'DELETE',
            url: '/chapters/{id}',
            path: {
                'id': id,
            },
            errors: {
                404: `El capítulo no existía o no pudo ser desvinculado.`,
            },
        });
    }
    /**
     * Publicar o despublicar un capítulo y sincronizar visibilidad en el grafo
     * @returns any Estado de visibilidad del capítulo y sus enlaces sincronizado con éxito.
     * @throws ApiError
     */
    public publishChapters({
        id,
        requestBody,
    }: {
        id: string,
        requestBody: {
            published?: boolean;
        },
    }): Observable<any> {
        return __request(OpenAPI, this.http, {
            method: 'PATCH',
            url: '/chapters/{id}/publish',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                404: `Capítulo no encontrado para publicar.`,
            },
        });
    }
}
