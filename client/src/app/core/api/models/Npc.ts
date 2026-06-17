/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { Tale } from './Tale';
import type { UsersDecisions } from './UsersDecisions';
export type Npc = {
    id?: string;
    name?: string;
    title?: string;
    npcType?: string;
    description?: Tale;
    meeting?: Tale;
    rejected?: Tale;
    decision?: UsersDecisions;
    items?: Array<string>;
    author?: string;
    published?: boolean;
    writeDate?: string;
};

