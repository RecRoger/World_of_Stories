/* generated using openapi-typescript-codegen -- do not edit */
/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { DecisionOption } from './DecisionOption';
export type UsersDecisions = {
    decisionType?: UsersDecisions.decisionType;
    amount?: number;
    item?: string;
    options?: Array<DecisionOption>;
};
export namespace UsersDecisions {
    export enum decisionType {
        CHOOSE = 'choose',
        ITEM = 'item',
        AMOUNT = 'amount',
    }
}

