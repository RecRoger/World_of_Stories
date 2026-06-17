/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Location } from './Location';
/**
 * Entidad de personaje que almacena el estado de la partida y el progreso individual
 */
export type Character = {
    name?: string;
    location?: Location;
    money?: number;
    items?: Array<string>;
    /**
     * IDs de relatos o fragmentos del Cosmere que este personaje específico ya leyó
     */
    fragmentsRead?: Array<string>;
    animations?: boolean;
};

