/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Character } from './Character';
export type User = {
    /**
     * ID nativo de MongoDB
     */
    _id?: string;
    /**
     * ID casteado para compatibilidad en Frontend
     */
    id?: string;
    username: string;
    email: string;
    /**
     * Hash encriptado
     */
    password: string;
    rol: Array<string>;
    characters?: Array<Character> | null;
    createdAt?: string;
    updatedAt?: string;
};

