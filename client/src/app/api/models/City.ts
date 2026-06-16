/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Place } from './Place';
import type { Tale } from './Tale';
export type City = {
    id?: string;
    name?: string;
    published?: boolean;
    publishDate?: string | null;
    description?: Array<Tale>;
    travel?: Array<Tale>;
    places?: Array<Place>;
    createdAt?: string;
    updatedAt?: string;
};

