import { Inject, Injectable, Optional } from '@angular/core';
import {
    HttpClient, HttpHeaders, HttpParams,
    HttpResponse, HttpEvent
} from '@angular/common/http';
import { CustomHttpUrlEncodingCodec } from '../encoder';

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
import { ResponseData } from '../model/responseData';
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

import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
import { Configuration } from '../configuration';


@Injectable({
    providedIn: 'root'
})
export class LocationsService {

    protected basePath = 'http://192.168.0.8:3000';
    public defaultHeaders = new HttpHeaders();
    public configuration = new Configuration();

    constructor(protected httpClient: HttpClient, @Optional() @Inject(BASE_PATH) basePath: string, @Optional() configuration: Configuration) {
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }

    /**
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    private canConsumeForm(consumes: string[]): boolean {
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }


    /**
     * Delete a City
     * Delete a City
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deleteCity(data: RequestDeleteCity, observe?: 'body', reportProgress?: boolean): Observable<ResponseDeleteCity>;
    public deleteCity(data: RequestDeleteCity, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseDeleteCity>>;
    public deleteCity(data: RequestDeleteCity, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseDeleteCity>>;
    public deleteCity(data: RequestDeleteCity, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling deleteCity.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseDeleteCity>(`${this.basePath}/cities/delete`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Delete a Place
     * Delete a Place
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public deletePlace(data: RequestDeletePlace, observe?: 'body', reportProgress?: boolean): Observable<ResponseDeletePlace>;
    public deletePlace(data: RequestDeletePlace, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseDeletePlace>>;
    public deletePlace(data: RequestDeletePlace, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseDeletePlace>>;
    public deletePlace(data: RequestDeletePlace, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling deletePlace.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseDeletePlace>(`${this.basePath}/places/delete`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get all Cities
     * Get all Cities, filtering by publish status
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getCities(data: RequestGetCities, observe?: 'body', reportProgress?: boolean): Observable<ResponseGetCities>;
    public getCities(data: RequestGetCities, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseGetCities>>;
    public getCities(data: RequestGetCities, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseGetCities>>;
    public getCities(data: RequestGetCities, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling getCities.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseGetCities>(`${this.basePath}/cities`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get City
     * Get complete info of one City
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getCity(data: RequestGetCity, observe?: 'body', reportProgress?: boolean): Observable<ResponseGetCity>;
    public getCity(data: RequestGetCity, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseGetCity>>;
    public getCity(data: RequestGetCity, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseGetCity>>;
    public getCity(data: RequestGetCity, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling getCity.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseGetCity>(`${this.basePath}/cities/city`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get Place
     * Get complete info of one Place
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getPlace(data: RequestGetPlace, observe?: 'body', reportProgress?: boolean): Observable<ResponseGetPlace>;
    public getPlace(data: RequestGetPlace, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseGetPlace>>;
    public getPlace(data: RequestGetPlace, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseGetPlace>>;
    public getPlace(data: RequestGetPlace, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling getPlace.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseGetPlace>(`${this.basePath}/places/place`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Get all Places of a City
     * Get all Places of a City filtering by publish status
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public getPlaces(data: RequestGetPlaces, observe?: 'body', reportProgress?: boolean): Observable<ResponseGetPlaces>;
    public getPlaces(data: RequestGetPlaces, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseGetPlaces>>;
    public getPlaces(data: RequestGetPlaces, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseGetPlaces>>;
    public getPlaces(data: RequestGetPlaces, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling getPlaces.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseGetPlaces>(`${this.basePath}/places`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Add new City
     * Add new City
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public newCity(data: RequestNewCity, observe?: 'body', reportProgress?: boolean): Observable<ResponseNewCity>;
    public newCity(data: RequestNewCity, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseNewCity>>;
    public newCity(data: RequestNewCity, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseNewCity>>;
    public newCity(data: RequestNewCity, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newCity.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseNewCity>(`${this.basePath}/cities/new`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Add description to City
     * Add new description to existing City
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public newCityDescription(data: RequestNewCityDescription, observe?: 'body', reportProgress?: boolean): Observable<ResponseNewCityDescription>;
    public newCityDescription(data: RequestNewCityDescription, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseNewCityDescription>>;
    public newCityDescription(data: RequestNewCityDescription, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseNewCityDescription>>;
    public newCityDescription(data: RequestNewCityDescription, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newCityDescription.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseNewCityDescription>(`${this.basePath}/cities/description/new`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Add travel to City
     * Add new travel to existing City
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public newCityTravel(data: RequestNewCityTravel, observe?: 'body', reportProgress?: boolean): Observable<ResponseNewCityTravel>;
    public newCityTravel(data: RequestNewCityTravel, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseNewCityTravel>>;
    public newCityTravel(data: RequestNewCityTravel, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseNewCityTravel>>;
    public newCityTravel(data: RequestNewCityTravel, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newCityTravel.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseNewCityTravel>(`${this.basePath}/cities/travel/new`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Add new Place
     * Add new Place in existing City
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public newPlace(data: RequestNewPlace, observe?: 'body', reportProgress?: boolean): Observable<ResponseNewPlace>;
    public newPlace(data: RequestNewPlace, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseNewPlace>>;
    public newPlace(data: RequestNewPlace, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseNewPlace>>;
    public newPlace(data: RequestNewPlace, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newPlace.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseNewPlace>(`${this.basePath}/places/new`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Add description to Place
     * Add new description to existing Place
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public newPlaceDescription(data: RequestNewPlaceDescription, observe?: 'body', reportProgress?: boolean): Observable<ResponseNewPlaceDescription>;
    public newPlaceDescription(data: RequestNewPlaceDescription, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseNewPlaceDescription>>;
    public newPlaceDescription(data: RequestNewPlaceDescription, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseNewPlaceDescription>>;
    public newPlaceDescription(data: RequestNewPlaceDescription, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newPlaceDescription.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseNewPlaceDescription>(`${this.basePath}/places/description/new`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Add Entry to Place
     * Add new Entry to existing Place
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public newPlaceEntry(data: RequestNewPlaceEntry, observe?: 'body', reportProgress?: boolean): Observable<ResponseNewPlaceEntry>;
    public newPlaceEntry(data: RequestNewPlaceEntry, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseNewPlaceEntry>>;
    public newPlaceEntry(data: RequestNewPlaceEntry, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseNewPlaceEntry>>;
    public newPlaceEntry(data: RequestNewPlaceEntry, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newPlaceEntry.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseNewPlaceEntry>(`${this.basePath}/places/entry/new`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Publish a City
     * Publish the City content to readers
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public publishCity(data: RequestPublishCity, observe?: 'body', reportProgress?: boolean): Observable<ResponsePublishCity>;
    public publishCity(data: RequestPublishCity, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponsePublishCity>>;
    public publishCity(data: RequestPublishCity, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponsePublishCity>>;
    public publishCity(data: RequestPublishCity, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling publishCity.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponsePublishCity>(`${this.basePath}/cities/publish`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Publish a Place
     * Publish the Place content to readers
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public publishPlace(data: RequestPublishPlace, observe?: 'body', reportProgress?: boolean): Observable<ResponsePublishPlace>;
    public publishPlace(data: RequestPublishPlace, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponsePublishPlace>>;
    public publishPlace(data: RequestPublishPlace, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponsePublishPlace>>;
    public publishPlace(data: RequestPublishPlace, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling publishPlace.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponsePublishPlace>(`${this.basePath}/places/publish`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Remove description from City
     * Remove new description from existing City
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public removeCityDescription(data: RequestRemoveCityDescription, observe?: 'body', reportProgress?: boolean): Observable<ResponseRemoveCityDescription>;
    public removeCityDescription(data: RequestRemoveCityDescription, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseRemoveCityDescription>>;
    public removeCityDescription(data: RequestRemoveCityDescription, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseRemoveCityDescription>>;
    public removeCityDescription(data: RequestRemoveCityDescription, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling removeCityDescription.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseRemoveCityDescription>(`${this.basePath}/cities/description/remove`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Remove travel from City
     * Remove new travel from existing City
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public removeCityTravel(data: RequestRemoveCityTravel, observe?: 'body', reportProgress?: boolean): Observable<ResponseRemoveCityTravel>;
    public removeCityTravel(data: RequestRemoveCityTravel, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseRemoveCityTravel>>;
    public removeCityTravel(data: RequestRemoveCityTravel, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseRemoveCityTravel>>;
    public removeCityTravel(data: RequestRemoveCityTravel, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling removeCityTravel.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseRemoveCityTravel>(`${this.basePath}/cities/travel/remove`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Remove description from Place
     * Remove new description from existing Place
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public removePlaceDescription(data: RequestRemovePlaceDescription, observe?: 'body', reportProgress?: boolean): Observable<ResponseRemovePlaceDescription>;
    public removePlaceDescription(data: RequestRemovePlaceDescription, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseRemovePlaceDescription>>;
    public removePlaceDescription(data: RequestRemovePlaceDescription, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseRemovePlaceDescription>>;
    public removePlaceDescription(data: RequestRemovePlaceDescription, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling removePlaceDescription.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseRemovePlaceDescription>(`${this.basePath}/places/description/remove`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Remove entry from Place
     * Remove new entry from existing Place
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public removePlaceEntry(data: RequestRemovePlaceEntry, observe?: 'body', reportProgress?: boolean): Observable<ResponseRemovePlaceEntry>;
    public removePlaceEntry(data: RequestRemovePlaceEntry, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseRemovePlaceEntry>>;
    public removePlaceEntry(data: RequestRemovePlaceEntry, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseRemovePlaceEntry>>;
    public removePlaceEntry(data: RequestRemovePlaceEntry, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling removePlaceEntry.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseRemovePlaceEntry>(`${this.basePath}/places/entry/remove`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Update City description
     * Update City description
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateCityDescription(data: RequestUpdateCityDescription, observe?: 'body', reportProgress?: boolean): Observable<ResponseUpdateCityDescription>;
    public updateCityDescription(data: RequestUpdateCityDescription, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseUpdateCityDescription>>;
    public updateCityDescription(data: RequestUpdateCityDescription, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseUpdateCityDescription>>;
    public updateCityDescription(data: RequestUpdateCityDescription, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling updateCityDescription.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseUpdateCityDescription>(`${this.basePath}/cities/description/update`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Update City travel
     * Update City travel
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updateCityTravel(data: RequestUpdateCityTravel, observe?: 'body', reportProgress?: boolean): Observable<ResponseUpdateCityTravel>;
    public updateCityTravel(data: RequestUpdateCityTravel, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseUpdateCityTravel>>;
    public updateCityTravel(data: RequestUpdateCityTravel, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseUpdateCityTravel>>;
    public updateCityTravel(data: RequestUpdateCityTravel, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling updateCityTravel.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseUpdateCityTravel>(`${this.basePath}/cities/travel/update`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Update Place description
     * Update Place description
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updatePlaceDescription(data: RequestUpdatePlaceDescription, observe?: 'body', reportProgress?: boolean): Observable<ResponseUpdatePlaceDescription>;
    public updatePlaceDescription(data: RequestUpdatePlaceDescription, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseUpdatePlaceDescription>>;
    public updatePlaceDescription(data: RequestUpdatePlaceDescription, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseUpdatePlaceDescription>>;
    public updatePlaceDescription(data: RequestUpdatePlaceDescription, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling updatePlaceDescription.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseUpdatePlaceDescription>(`${this.basePath}/places/description/update`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

    /**
     * Update Place entry
     * Update Place entry
     * @param data Transaction details
     * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
     * @param reportProgress flag to report request and response progress.
     */
    public updatePlaceEntry(data: RequestUpdatePlaceEntry, observe?: 'body', reportProgress?: boolean): Observable<ResponseUpdatePlaceEntry>;
    public updatePlaceEntry(data: RequestUpdatePlaceEntry, observe?: 'response', reportProgress?: boolean): Observable<HttpResponse<ResponseUpdatePlaceEntry>>;
    public updatePlaceEntry(data: RequestUpdatePlaceEntry, observe?: 'events', reportProgress?: boolean): Observable<HttpEvent<ResponseUpdatePlaceEntry>>;
    public updatePlaceEntry(data: RequestUpdatePlaceEntry, observe: any = 'body', reportProgress: boolean = false): Observable<any> {

        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling updatePlaceEntry.');
        }

        let headers = this.defaultHeaders;

        // to determine the Accept header
        let httpHeaderAccepts: string[] = [
            'application/json'
        ];
        const httpHeaderAcceptSelected: string | undefined = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }

        // to determine the Content-Type header
        const consumes: string[] = [
            'application/json'
        ];
        const httpContentTypeSelected: string | undefined = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }

        return this.httpClient.post<ResponseUpdatePlaceEntry>(`${this.basePath}/places/entry/update`,
            data,
            {
                withCredentials: this.configuration.withCredentials,
                headers: headers,
                observe: observe,
                reportProgress: reportProgress
            }
        );
    }

}
