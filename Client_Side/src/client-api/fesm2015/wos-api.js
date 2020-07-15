import { InjectionToken, Inject, Injectable, Optional, defineInjectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/**
 * @fileoverview added by tsickle
 * Generated from: variables.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
const BASE_PATH = new InjectionToken('basePath');

/**
 * @fileoverview added by tsickle
 * Generated from: configuration.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class Configuration {
    /**
     * @param {?=} configurationParameters
     */
    constructor(configurationParameters = {}) {
        this.apiKeys = configurationParameters.apiKeys;
        this.username = configurationParameters.username;
        this.password = configurationParameters.password;
        this.accessToken = configurationParameters.accessToken;
        this.basePath = configurationParameters.basePath;
        this.withCredentials = configurationParameters.withCredentials;
    }
    /**
     * Select the correct content-type to use for a request.
     * Uses {\@link Configuration#isJsonMime} to determine the correct content-type.
     * If no content type is found return the first found type if the contentTypes is not empty
     * @param {?} contentTypes - the array of content types that are available for selection
     * @return {?} the selected content-type or <code>undefined</code> if no selection could be made.
     */
    selectHeaderContentType(contentTypes) {
        if (contentTypes.length == 0) {
            return undefined;
        }
        /** @type {?} */
        let type = contentTypes.find((/**
         * @param {?} x
         * @return {?}
         */
        x => this.isJsonMime(x)));
        if (type === undefined) {
            return contentTypes[0];
        }
        return type;
    }
    /**
     * Select the correct accept content-type to use for a request.
     * Uses {\@link Configuration#isJsonMime} to determine the correct accept content-type.
     * If no content type is found return the first found type if the contentTypes is not empty
     * @param {?} accepts - the array of content types that are available for selection.
     * @return {?} the selected content-type or <code>undefined</code> if no selection could be made.
     */
    selectHeaderAccept(accepts) {
        if (accepts.length == 0) {
            return undefined;
        }
        /** @type {?} */
        let type = accepts.find((/**
         * @param {?} x
         * @return {?}
         */
        x => this.isJsonMime(x)));
        if (type === undefined) {
            return accepts[0];
        }
        return type;
    }
    /**
     * Check if the given MIME is a JSON MIME.
     * JSON MIME examples:
     *   application/json
     *   application/json; charset=UTF8
     *   APPLICATION/JSON
     *   application/vnd.company+json
     * @param {?} mime - MIME (Multipurpose Internet Mail Extensions)
     * @return {?} True if the given MIME is JSON, false otherwise.
     */
    isJsonMime(mime) {
        /** @type {?} */
        const jsonMime = new RegExp('^(application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
        return mime != null && (jsonMime.test(mime) || mime.toLowerCase() === 'application/json-patch+json');
    }
}

/**
 * @fileoverview added by tsickle
 * Generated from: api/locations.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class LocationsService {
    /**
     * @param {?} httpClient
     * @param {?} basePath
     * @param {?} configuration
     */
    constructor(httpClient, basePath, configuration) {
        this.httpClient = httpClient;
        this.basePath = 'http://localhost:3000';
        this.defaultHeaders = new HttpHeaders();
        this.configuration = new Configuration();
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }
    /**
     * @private
     * @param {?} consumes string[] mime-types
     * @return {?} true: consumes contains 'multipart/form-data', false: otherwise
     */
    canConsumeForm(consumes) {
        /** @type {?} */
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    deleteCity(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling deleteCity.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/cities/delete`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    deletePlace(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling deletePlace.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/places/delete`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    getCities(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling getCities.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/cities`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    getCity(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling getCity.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/cities/city`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    getPlace(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling getPlace.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/places/place`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    getPlaces(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling getPlaces.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/places`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    newCity(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newCity.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/cities/new`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    newCityDescription(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newCityDescription.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/cities/description/new`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    newCityTravel(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newCityTravel.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/cities/travel/new`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    newPlace(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newPlace.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/places/new`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    newPlaceDescription(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newPlaceDescription.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/places/description/new`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    newPlaceEntry(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newPlaceEntry.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/places/entry/new`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    publishCity(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling publishCity.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/cities/publish`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    publishPlace(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling publishPlace.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/places/publish`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    removeCityDescription(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling removeCityDescription.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/cities/description/remove`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    removeCityTravel(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling removeCityTravel.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/cities/travel/remove`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    removePlaceDescription(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling removePlaceDescription.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/places/description/remove`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    removePlaceEntry(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling removePlaceEntry.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/places/entry/remove`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    updateCityDescription(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling updateCityDescription.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/cities/description/update`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    updateCityTravel(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling updateCityTravel.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/cities/travel/update`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    updatePlaceDescription(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling updatePlaceDescription.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/places/description/update`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    updatePlaceEntry(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling updatePlaceEntry.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/places/entry/update`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
}
LocationsService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
LocationsService.ctorParameters = () => [
    { type: HttpClient },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [BASE_PATH,] }] },
    { type: Configuration, decorators: [{ type: Optional }] }
];
/** @nocollapse */ LocationsService.ngInjectableDef = defineInjectable({ factory: function LocationsService_Factory() { return new LocationsService(inject(HttpClient), inject(BASE_PATH, 8), inject(Configuration, 8)); }, token: LocationsService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * Generated from: api/users.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
class UsersService {
    /**
     * @param {?} httpClient
     * @param {?} basePath
     * @param {?} configuration
     */
    constructor(httpClient, basePath, configuration) {
        this.httpClient = httpClient;
        this.basePath = 'http://localhost:3000';
        this.defaultHeaders = new HttpHeaders();
        this.configuration = new Configuration();
        if (basePath) {
            this.basePath = basePath;
        }
        if (configuration) {
            this.configuration = configuration;
            this.basePath = basePath || configuration.basePath || this.basePath;
        }
    }
    /**
     * @private
     * @param {?} consumes string[] mime-types
     * @return {?} true: consumes contains 'multipart/form-data', false: otherwise
     */
    canConsumeForm(consumes) {
        /** @type {?} */
        const form = 'multipart/form-data';
        for (const consume of consumes) {
            if (form === consume) {
                return true;
            }
        }
        return false;
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    deleteUser(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling deleteUser.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/users/delete`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    getUser(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling getUser.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/users/user`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    getUsers(observe = 'body', reportProgress = false) {
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        return this.httpClient.get(`${this.basePath}/users`, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    login(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling login.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/users/login`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    removeRol(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling removeRol.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/users/remove_rol`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    setRol(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling setRol.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/users/set_rol`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    signin(data, observe = 'body', reportProgress = false) {
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling signin.');
        }
        /** @type {?} */
        let headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        let httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        const httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        const consumes = [
            'application/json'
        ];
        /** @type {?} */
        const httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(`${this.basePath}/users/signin`, data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    }
}
UsersService.decorators = [
    { type: Injectable, args: [{
                providedIn: 'root'
            },] }
];
/** @nocollapse */
UsersService.ctorParameters = () => [
    { type: HttpClient },
    { type: String, decorators: [{ type: Optional }, { type: Inject, args: [BASE_PATH,] }] },
    { type: Configuration, decorators: [{ type: Optional }] }
];
/** @nocollapse */ UsersService.ngInjectableDef = defineInjectable({ factory: function UsersService_Factory() { return new UsersService(inject(HttpClient), inject(BASE_PATH, 8), inject(Configuration, 8)); }, token: UsersService, providedIn: "root" });

/**
 * @fileoverview added by tsickle
 * Generated from: api/api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/city.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/cityData.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/cityDescriptionEdition.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/cityTravelEdition.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/errorMsg.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/listCities.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/listPlaces.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/listUsers.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/place.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/placeData.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/placeDescriptionEdition.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/placeEntryEdition.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/publicTale.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/readFragment.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestDeleteCity.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestDeletePlace.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestDeleteUser.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestGetCities.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestGetCity.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestGetPlace.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestGetPlaces.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestGetUser.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestLogin.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestNewCity.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestNewCityDescription.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestNewCityTravel.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestNewPlace.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestNewPlaceDescription.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestNewPlaceEntry.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestPublishCity.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestPublishPlace.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestRemoveCityDescription.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestRemoveCityTravel.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestRemovePlaceDescription.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestRemovePlaceEntry.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestRemoveRol.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestSetRol.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestSignin.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestUpdateCityDescription.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestUpdateCityTravel.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestUpdatePlaceDescription.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestUpdatePlaceEntry.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseData.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseDeleteCity.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseDeletePlace.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseDeleteUser.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseGetCities.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseGetCity.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseGetPlace.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseGetPlaces.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseGetUser.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseGetUsers.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseLogin.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseNewCity.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseNewCityDescription.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseNewCityTravel.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseNewPlace.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseNewPlaceDescription.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseNewPlaceEntry.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responsePublishCity.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responsePublishPlace.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseRemoveCityDescription.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseRemoveCityTravel.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseRemovePlaceDescription.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseRemovePlaceEntry.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseRemoveRol.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseSetRol.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseSignin.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseUpdateCityDescription.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseUpdateCityTravel.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseUpdatePlaceDescription.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseUpdatePlaceEntry.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/user.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/userData.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/models.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: index.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: wos-api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

export { LocationsService, UsersService, Configuration, BASE_PATH as ɵa };

//# sourceMappingURL=wos-api.js.map