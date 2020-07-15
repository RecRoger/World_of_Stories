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
import { HttpClient, HttpHeaders, HttpResponse, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { RequestDeleteCity } from '../model/requestDeleteCity';
import { RequestDeletePlace } from '../model/requestDeletePlace';
import { RequestGetCities } from '../model/requestGetCities';
import { RequestGetCity } from '../model/requestGetCity';
import { RequestGetPlace } from '../model/requestGetPlace';
import { RequestGetPlaces } from '../model/requestGetPlaces';
import { RequestNewCity } from '../model/requestNewCity';
import { RequestNewCityDescription } from '../model/requestNewCityDescription';
import { RequestNewCityTravel } from '../model/requestNewCityTravel';
import { RequestNewPlace } from '../model/requestNewPlace';
import { RequestNewPlaceDescription } from '../model/requestNewPlaceDescription';
import { RequestNewPlaceEntry } from '../model/requestNewPlaceEntry';
import { RequestPublishCity } from '../model/requestPublishCity';
import { RequestPublishPlace } from '../model/requestPublishPlace';
import { RequestRemoveCityDescription } from '../model/requestRemoveCityDescription';
import { RequestRemoveCityTravel } from '../model/requestRemoveCityTravel';
import { RequestRemovePlaceDescription } from '../model/requestRemovePlaceDescription';
import { RequestRemovePlaceEntry } from '../model/requestRemovePlaceEntry';
import { RequestUpdateCityDescription } from '../model/requestUpdateCityDescription';
import { RequestUpdateCityTravel } from '../model/requestUpdateCityTravel';
import { RequestUpdatePlaceDescription } from '../model/requestUpdatePlaceDescription';
import { RequestUpdatePlaceEntry } from '../model/requestUpdatePlaceEntry';
import { ResponseDeleteCity } from '../model/responseDeleteCity';
import { ResponseDeletePlace } from '../model/responseDeletePlace';
import { ResponseGetCities } from '../model/responseGetCities';
import { ResponseGetCity } from '../model/responseGetCity';
import { ResponseGetPlace } from '../model/responseGetPlace';
import { ResponseGetPlaces } from '../model/responseGetPlaces';
import { ResponseNewCity } from '../model/responseNewCity';
import { ResponseNewCityDescription } from '../model/responseNewCityDescription';
import { ResponseNewCityTravel } from '../model/responseNewCityTravel';
import { ResponseNewPlace } from '../model/responseNewPlace';
import { ResponseNewPlaceDescription } from '../model/responseNewPlaceDescription';
import { ResponseNewPlaceEntry } from '../model/responseNewPlaceEntry';
import { ResponsePublishCity } from '../model/responsePublishCity';
import { ResponsePublishPlace } from '../model/responsePublishPlace';
import { ResponseRemoveCityDescription } from '../model/responseRemoveCityDescription';
import { ResponseRemoveCityTravel } from '../model/responseRemoveCityTravel';
import { ResponseRemovePlaceDescription } from '../model/responseRemovePlaceDescription';
import { ResponseRemovePlaceEntry } from '../model/responseRemovePlaceEntry';
import { ResponseUpdateCityDescription } from '../model/responseUpdateCityDescription';
import { ResponseUpdateCityTravel } from '../model/responseUpdateCityTravel';
import { ResponseUpdatePlaceDescription } from '../model/responseUpdatePlaceDescription';
import { ResponseUpdatePlaceEntry } from '../model/responseUpdatePlaceEntry';
import { Configuration } from '../configuration';
export declare class LocationsService {
    protected httpClient: HttpClient;
    protected basePath: string;
    defaultHeaders: HttpHeaders;
    configuration: Configuration;
    constructor(httpClient: HttpClient, basePath: string, configuration: Configuration);
    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm;
    /**
     * Delete a City
     * Delete a City
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    deleteCity(data: RequestDeleteCity, observe?: 'body', reportProgress?: boolean): Observable<ResponseDeleteCity>;
    deleteCity(data: RequestDeleteCity, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseDeleteCity>>;
    deleteCity(data: RequestDeleteCity, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseDeleteCity>>;
    /**
     * Delete a Place
     * Delete a Place
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    deletePlace(data: RequestDeletePlace, observe?: 'body', reportProgress?: boolean): Observable<ResponseDeletePlace>;
    deletePlace(data: RequestDeletePlace, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseDeletePlace>>;
    deletePlace(data: RequestDeletePlace, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseDeletePlace>>;
    /**
     * Get all Cities
     * Get all Cities, filtering by publish status
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    getCities(data: RequestGetCities, observe?: 'body', reportProgress?: boolean): Observable<ResponseGetCities>;
    getCities(data: RequestGetCities, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseGetCities>>;
    getCities(data: RequestGetCities, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseGetCities>>;
    /**
     * Get City
     * Get complete info of one City
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    getCity(data: RequestGetCity, observe?: 'body', reportProgress?: boolean): Observable<ResponseGetCity>;
    getCity(data: RequestGetCity, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseGetCity>>;
    getCity(data: RequestGetCity, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseGetCity>>;
    /**
     * Get Place
     * Get complete info of one Place
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    getPlace(data: RequestGetPlace, observe?: 'body', reportProgress?: boolean): Observable<ResponseGetPlace>;
    getPlace(data: RequestGetPlace, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseGetPlace>>;
    getPlace(data: RequestGetPlace, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseGetPlace>>;
    /**
     * Get all Places of a City
     * Get all Places of a City filtering by publish status
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    getPlaces(data: RequestGetPlaces, observe?: 'body', reportProgress?: boolean): Observable<ResponseGetPlaces>;
    getPlaces(data: RequestGetPlaces, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseGetPlaces>>;
    getPlaces(data: RequestGetPlaces, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseGetPlaces>>;
    /**
     * Add new City
     * Add new City
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    newCity(data: RequestNewCity, observe?: 'body', reportProgress?: boolean): Observable<ResponseNewCity>;
    newCity(data: RequestNewCity, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseNewCity>>;
    newCity(data: RequestNewCity, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseNewCity>>;
    /**
     * Add description to City
     * Add new description to existing City
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    newCityDescription(data: RequestNewCityDescription, observe?: 'body', reportProgress?: boolean): Observable<ResponseNewCityDescription>;
    newCityDescription(data: RequestNewCityDescription, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseNewCityDescription>>;
    newCityDescription(data: RequestNewCityDescription, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseNewCityDescription>>;
    /**
     * Add travel to City
     * Add new travel to existing City
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    newCityTravel(data: RequestNewCityTravel, observe?: 'body', reportProgress?: boolean): Observable<ResponseNewCityTravel>;
    newCityTravel(data: RequestNewCityTravel, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseNewCityTravel>>;
    newCityTravel(data: RequestNewCityTravel, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseNewCityTravel>>;
    /**
     * Add new Place
     * Add new Place in existing City
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    newPlace(data: RequestNewPlace, observe?: 'body', reportProgress?: boolean): Observable<ResponseNewPlace>;
    newPlace(data: RequestNewPlace, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseNewPlace>>;
    newPlace(data: RequestNewPlace, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseNewPlace>>;
    /**
     * Add description to Place
     * Add new description to existing Place
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    newPlaceDescription(data: RequestNewPlaceDescription, observe?: 'body', reportProgress?: boolean): Observable<ResponseNewPlaceDescription>;
    newPlaceDescription(data: RequestNewPlaceDescription, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseNewPlaceDescription>>;
    newPlaceDescription(data: RequestNewPlaceDescription, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseNewPlaceDescription>>;
    /**
     * Add Entry to Place
     * Add new Entry to existing Place
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    newPlaceEntry(data: RequestNewPlaceEntry, observe?: 'body', reportProgress?: boolean): Observable<ResponseNewPlaceEntry>;
    newPlaceEntry(data: RequestNewPlaceEntry, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseNewPlaceEntry>>;
    newPlaceEntry(data: RequestNewPlaceEntry, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseNewPlaceEntry>>;
    /**
     * Publish a City
     * Publish the City content to readers
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    publishCity(data: RequestPublishCity, observe?: 'body', reportProgress?: boolean): Observable<ResponsePublishCity>;
    publishCity(data: RequestPublishCity, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponsePublishCity>>;
    publishCity(data: RequestPublishCity, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponsePublishCity>>;
    /**
     * Publish a Place
     * Publish the Place content to readers
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    publishPlace(data: RequestPublishPlace, observe?: 'body', reportProgress?: boolean): Observable<ResponsePublishPlace>;
    publishPlace(data: RequestPublishPlace, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponsePublishPlace>>;
    publishPlace(data: RequestPublishPlace, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponsePublishPlace>>;
    /**
     * Remove description from City
     * Remove new description from existing City
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    removeCityDescription(data: RequestRemoveCityDescription, observe?: 'body', reportProgress?: boolean): Observable<ResponseRemoveCityDescription>;
    removeCityDescription(data: RequestRemoveCityDescription, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseRemoveCityDescription>>;
    removeCityDescription(data: RequestRemoveCityDescription, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseRemoveCityDescription>>;
    /**
     * Remove travel from City
     * Remove new travel from existing City
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    removeCityTravel(data: RequestRemoveCityTravel, observe?: 'body', reportProgress?: boolean): Observable<ResponseRemoveCityTravel>;
    removeCityTravel(data: RequestRemoveCityTravel, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseRemoveCityTravel>>;
    removeCityTravel(data: RequestRemoveCityTravel, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseRemoveCityTravel>>;
    /**
     * Remove description from Place
     * Remove new description from existing Place
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    removePlaceDescription(data: RequestRemovePlaceDescription, observe?: 'body', reportProgress?: boolean): Observable<ResponseRemovePlaceDescription>;
    removePlaceDescription(data: RequestRemovePlaceDescription, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseRemovePlaceDescription>>;
    removePlaceDescription(data: RequestRemovePlaceDescription, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseRemovePlaceDescription>>;
    /**
     * Remove entry from Place
     * Remove new entry from existing Place
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    removePlaceEntry(data: RequestRemovePlaceEntry, observe?: 'body', reportProgress?: boolean): Observable<ResponseRemovePlaceEntry>;
    removePlaceEntry(data: RequestRemovePlaceEntry, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseRemovePlaceEntry>>;
    removePlaceEntry(data: RequestRemovePlaceEntry, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseRemovePlaceEntry>>;
    /**
     * Update City description
     * Update City description
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    updateCityDescription(data: RequestUpdateCityDescription, observe?: 'body', reportProgress?: boolean): Observable<ResponseUpdateCityDescription>;
    updateCityDescription(data: RequestUpdateCityDescription, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseUpdateCityDescription>>;
    updateCityDescription(data: RequestUpdateCityDescription, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseUpdateCityDescription>>;
    /**
     * Update City travel
     * Update City travel
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    updateCityTravel(data: RequestUpdateCityTravel, observe?: 'body', reportProgress?: boolean): Observable<ResponseUpdateCityTravel>;
    updateCityTravel(data: RequestUpdateCityTravel, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseUpdateCityTravel>>;
    updateCityTravel(data: RequestUpdateCityTravel, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseUpdateCityTravel>>;
    /**
     * Update Place description
     * Update Place description
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    updatePlaceDescription(data: RequestUpdatePlaceDescription, observe?: 'body', reportProgress?: boolean): Observable<ResponseUpdatePlaceDescription>;
    updatePlaceDescription(data: RequestUpdatePlaceDescription, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseUpdatePlaceDescription>>;
    updatePlaceDescription(data: RequestUpdatePlaceDescription, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseUpdatePlaceDescription>>;
    /**
     * Update Place entry
     * Update Place entry
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    updatePlaceEntry(data: RequestUpdatePlaceEntry, observe?: 'body', reportProgress?: boolean): Observable<ResponseUpdatePlaceEntry>;
    updatePlaceEntry(data: RequestUpdatePlaceEntry, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseUpdatePlaceEntry>>;
    updatePlaceEntry(data: RequestUpdatePlaceEntry, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseUpdatePlaceEntry>>;
}
