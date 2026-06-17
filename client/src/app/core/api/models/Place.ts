/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Tale } from './Tale';
export type Place = {
    id?: string;
    name?: string;
    published?: boolean;
    publishDate?: string;
    /**
     * IDs de los NPCs vinculados a este lugar
     */
    events?: Array<string>;
    description?: Array<Tale>;
    entry?: Array<Tale>;
};

