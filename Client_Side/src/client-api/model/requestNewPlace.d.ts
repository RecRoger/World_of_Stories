/**
 * World_of_Stories-Api
 * Interactive stories application for NodeJs typescript server
 *
 * OpenAPI spec version: 1.0.0
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */
import { ReadFragment } from './readFragment';
export interface RequestNewPlace {
    cityId?: string;
    userName?: string;
    name?: string;
    description?: Array<ReadFragment>;
    entry?: Array<ReadFragment>;
}
