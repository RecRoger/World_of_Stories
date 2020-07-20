import { __values } from 'tslib';
import { InjectionToken, Inject, Injectable, Optional, defineInjectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

/**
 * @fileoverview added by tsickle
 * Generated from: variables.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
/** @type {?} */
var BASE_PATH = new InjectionToken('basePath');

/**
 * @fileoverview added by tsickle
 * Generated from: configuration.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var Configuration = /** @class */ (function () {
    function Configuration(configurationParameters) {
        if (configurationParameters === void 0) { configurationParameters = {}; }
        this.apiKeys = configurationParameters.apiKeys;
        this.username = configurationParameters.username;
        this.password = configurationParameters.password;
        this.accessToken = configurationParameters.accessToken;
        this.basePath = configurationParameters.basePath;
        this.withCredentials = configurationParameters.withCredentials;
    }
    /**
     * Select the correct content-type to use for a request.
     * Uses {@link Configuration#isJsonMime} to determine the correct content-type.
     * If no content type is found return the first found type if the contentTypes is not empty
     * @param contentTypes - the array of content types that are available for selection
     * @returns the selected content-type or <code>undefined</code> if no selection could be made.
     */
    /**
     * Select the correct content-type to use for a request.
     * Uses {\@link Configuration#isJsonMime} to determine the correct content-type.
     * If no content type is found return the first found type if the contentTypes is not empty
     * @param {?} contentTypes - the array of content types that are available for selection
     * @return {?} the selected content-type or <code>undefined</code> if no selection could be made.
     */
    Configuration.prototype.selectHeaderContentType = /**
     * Select the correct content-type to use for a request.
     * Uses {\@link Configuration#isJsonMime} to determine the correct content-type.
     * If no content type is found return the first found type if the contentTypes is not empty
     * @param {?} contentTypes - the array of content types that are available for selection
     * @return {?} the selected content-type or <code>undefined</code> if no selection could be made.
     */
    function (contentTypes) {
        var _this = this;
        if (contentTypes.length == 0) {
            return undefined;
        }
        /** @type {?} */
        var type = contentTypes.find((/**
         * @param {?} x
         * @return {?}
         */
        function (x) { return _this.isJsonMime(x); }));
        if (type === undefined) {
            return contentTypes[0];
        }
        return type;
    };
    /**
     * Select the correct accept content-type to use for a request.
     * Uses {@link Configuration#isJsonMime} to determine the correct accept content-type.
     * If no content type is found return the first found type if the contentTypes is not empty
     * @param accepts - the array of content types that are available for selection.
     * @returns the selected content-type or <code>undefined</code> if no selection could be made.
     */
    /**
     * Select the correct accept content-type to use for a request.
     * Uses {\@link Configuration#isJsonMime} to determine the correct accept content-type.
     * If no content type is found return the first found type if the contentTypes is not empty
     * @param {?} accepts - the array of content types that are available for selection.
     * @return {?} the selected content-type or <code>undefined</code> if no selection could be made.
     */
    Configuration.prototype.selectHeaderAccept = /**
     * Select the correct accept content-type to use for a request.
     * Uses {\@link Configuration#isJsonMime} to determine the correct accept content-type.
     * If no content type is found return the first found type if the contentTypes is not empty
     * @param {?} accepts - the array of content types that are available for selection.
     * @return {?} the selected content-type or <code>undefined</code> if no selection could be made.
     */
    function (accepts) {
        var _this = this;
        if (accepts.length == 0) {
            return undefined;
        }
        /** @type {?} */
        var type = accepts.find((/**
         * @param {?} x
         * @return {?}
         */
        function (x) { return _this.isJsonMime(x); }));
        if (type === undefined) {
            return accepts[0];
        }
        return type;
    };
    /**
     * Check if the given MIME is a JSON MIME.
     * JSON MIME examples:
     *   application/json
     *   application/json; charset=UTF8
     *   APPLICATION/JSON
     *   application/vnd.company+json
     * @param mime - MIME (Multipurpose Internet Mail Extensions)
     * @return True if the given MIME is JSON, false otherwise.
     */
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
    Configuration.prototype.isJsonMime = /**
     * Check if the given MIME is a JSON MIME.
     * JSON MIME examples:
     *   application/json
     *   application/json; charset=UTF8
     *   APPLICATION/JSON
     *   application/vnd.company+json
     * @param {?} mime - MIME (Multipurpose Internet Mail Extensions)
     * @return {?} True if the given MIME is JSON, false otherwise.
     */
    function (mime) {
        /** @type {?} */
        var jsonMime = new RegExp('^(application\/json|[^;/ \t]+\/[^;/ \t]+[+]json)[ \t]*(;.*)?$', 'i');
        return mime != null && (jsonMime.test(mime) || mime.toLowerCase() === 'application/json-patch+json');
    };
    return Configuration;
}());

/**
 * @fileoverview added by tsickle
 * Generated from: api/locations.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var LocationsService = /** @class */ (function () {
    function LocationsService(httpClient, basePath, configuration) {
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
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    /**
     * @private
     * @param {?} consumes string[] mime-types
     * @return {?} true: consumes contains 'multipart/form-data', false: otherwise
     */
    LocationsService.prototype.canConsumeForm = /**
     * @private
     * @param {?} consumes string[] mime-types
     * @return {?} true: consumes contains 'multipart/form-data', false: otherwise
     */
    function (consumes) {
        var e_1, _a;
        /** @type {?} */
        var form = 'multipart/form-data';
        try {
            for (var consumes_1 = __values(consumes), consumes_1_1 = consumes_1.next(); !consumes_1_1.done; consumes_1_1 = consumes_1.next()) {
                var consume = consumes_1_1.value;
                if (form === consume) {
                    return true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (consumes_1_1 && !consumes_1_1.done && (_a = consumes_1.return)) _a.call(consumes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return false;
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.deleteCity = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling deleteCity.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/cities/delete", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.deletePlace = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling deletePlace.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/places/delete", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.getCities = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling getCities.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/cities", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.getCity = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling getCity.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/cities/city", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.getPlace = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling getPlace.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/places/place", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.getPlaces = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling getPlaces.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/places", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.newCity = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newCity.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/cities/new", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.newCityDescription = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newCityDescription.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/cities/description/new", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.newCityTravel = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newCityTravel.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/cities/travel/new", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.newPlace = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newPlace.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/places/new", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.newPlaceDescription = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newPlaceDescription.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/places/description/new", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.newPlaceEntry = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newPlaceEntry.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/places/entry/new", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.publishCity = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling publishCity.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/cities/publish", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.publishPlace = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling publishPlace.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/places/publish", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.removeCityDescription = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling removeCityDescription.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/cities/description/remove", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.removeCityTravel = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling removeCityTravel.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/cities/travel/remove", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.removePlaceDescription = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling removePlaceDescription.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/places/description/remove", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.removePlaceEntry = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling removePlaceEntry.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/places/entry/remove", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.updateCityDescription = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling updateCityDescription.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/cities/description/update", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.updateCityTravel = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling updateCityTravel.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/cities/travel/update", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.updatePlaceDescription = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling updatePlaceDescription.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/places/description/update", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    LocationsService.prototype.updatePlaceEntry = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling updatePlaceEntry.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/places/entry/update", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    LocationsService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    LocationsService.ctorParameters = function () { return [
        { type: HttpClient },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [BASE_PATH,] }] },
        { type: Configuration, decorators: [{ type: Optional }] }
    ]; };
    /** @nocollapse */ LocationsService.ngInjectableDef = defineInjectable({ factory: function LocationsService_Factory() { return new LocationsService(inject(HttpClient), inject(BASE_PATH, 8), inject(Configuration, 8)); }, token: LocationsService, providedIn: "root" });
    return LocationsService;
}());

/**
 * @fileoverview added by tsickle
 * Generated from: api/stories.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var StoriesService = /** @class */ (function () {
    function StoriesService(httpClient, basePath, configuration) {
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
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    /**
     * @private
     * @param {?} consumes string[] mime-types
     * @return {?} true: consumes contains 'multipart/form-data', false: otherwise
     */
    StoriesService.prototype.canConsumeForm = /**
     * @private
     * @param {?} consumes string[] mime-types
     * @return {?} true: consumes contains 'multipart/form-data', false: otherwise
     */
    function (consumes) {
        var e_1, _a;
        /** @type {?} */
        var form = 'multipart/form-data';
        try {
            for (var consumes_1 = __values(consumes), consumes_1_1 = consumes_1.next(); !consumes_1_1.done; consumes_1_1 = consumes_1.next()) {
                var consume = consumes_1_1.value;
                if (form === consume) {
                    return true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (consumes_1_1 && !consumes_1_1.done && (_a = consumes_1.return)) _a.call(consumes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return false;
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    StoriesService.prototype.deleteChapter = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling deleteChapter.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/chapters/delete", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    StoriesService.prototype.deleteNpc = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling deleteNpc.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/npcs/delete", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    StoriesService.prototype.getChapters = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling getChapters.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/chapters", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    StoriesService.prototype.getCity = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling getCity.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/npcs/npc", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    StoriesService.prototype.getNpcs = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling getNpcs.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/npcs", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    StoriesService.prototype.newNpc = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling newNpc.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/npcs/new", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    StoriesService.prototype.publishChapter = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling publishChapter.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/chapters/publish", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    StoriesService.prototype.publishNpc = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling publishNpc.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/npcs/publish", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    StoriesService.prototype.updateChapter = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling updateChapter.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/chapters/update", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    StoriesService.prototype.updateNpc = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling updateNpc.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/npcs/update", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    StoriesService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    StoriesService.ctorParameters = function () { return [
        { type: HttpClient },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [BASE_PATH,] }] },
        { type: Configuration, decorators: [{ type: Optional }] }
    ]; };
    /** @nocollapse */ StoriesService.ngInjectableDef = defineInjectable({ factory: function StoriesService_Factory() { return new StoriesService(inject(HttpClient), inject(BASE_PATH, 8), inject(Configuration, 8)); }, token: StoriesService, providedIn: "root" });
    return StoriesService;
}());

/**
 * @fileoverview added by tsickle
 * Generated from: api/users.service.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
var UsersService = /** @class */ (function () {
    function UsersService(httpClient, basePath, configuration) {
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
     * @param consumes string[] mime-types
     * @return true: consumes contains 'multipart/form-data', false: otherwise
     */
    /**
     * @private
     * @param {?} consumes string[] mime-types
     * @return {?} true: consumes contains 'multipart/form-data', false: otherwise
     */
    UsersService.prototype.canConsumeForm = /**
     * @private
     * @param {?} consumes string[] mime-types
     * @return {?} true: consumes contains 'multipart/form-data', false: otherwise
     */
    function (consumes) {
        var e_1, _a;
        /** @type {?} */
        var form = 'multipart/form-data';
        try {
            for (var consumes_1 = __values(consumes), consumes_1_1 = consumes_1.next(); !consumes_1_1.done; consumes_1_1 = consumes_1.next()) {
                var consume = consumes_1_1.value;
                if (form === consume) {
                    return true;
                }
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (consumes_1_1 && !consumes_1_1.done && (_a = consumes_1.return)) _a.call(consumes_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        return false;
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    UsersService.prototype.deleteUser = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling deleteUser.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/users/delete", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    UsersService.prototype.getUser = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling getUser.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/users/user", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    UsersService.prototype.getUsers = /**
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        return this.httpClient.get(this.basePath + "/users", {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    UsersService.prototype.login = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling login.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/users/login", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    UsersService.prototype.removeRol = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling removeRol.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/users/remove_rol", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    UsersService.prototype.setRol = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling setRol.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/users/set_rol", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    UsersService.prototype.signin = /**
     * @param {?} data
     * @param {?=} observe
     * @param {?=} reportProgress
     * @return {?}
     */
    function (data, observe, reportProgress) {
        if (observe === void 0) { observe = 'body'; }
        if (reportProgress === void 0) { reportProgress = false; }
        if (data === null || data === undefined) {
            throw new Error('Required parameter data was null or undefined when calling signin.');
        }
        /** @type {?} */
        var headers = this.defaultHeaders;
        // to determine the Accept header
        /** @type {?} */
        var httpHeaderAccepts = [
            'application/json'
        ];
        /** @type {?} */
        var httpHeaderAcceptSelected = this.configuration.selectHeaderAccept(httpHeaderAccepts);
        if (httpHeaderAcceptSelected != undefined) {
            headers = headers.set('Accept', httpHeaderAcceptSelected);
        }
        // to determine the Content-Type header
        /** @type {?} */
        var consumes = [
            'application/json'
        ];
        /** @type {?} */
        var httpContentTypeSelected = this.configuration.selectHeaderContentType(consumes);
        if (httpContentTypeSelected != undefined) {
            headers = headers.set('Content-Type', httpContentTypeSelected);
        }
        return this.httpClient.post(this.basePath + "/users/signin", data, {
            withCredentials: this.configuration.withCredentials,
            headers: headers,
            observe: observe,
            reportProgress: reportProgress
        });
    };
    UsersService.decorators = [
        { type: Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    UsersService.ctorParameters = function () { return [
        { type: HttpClient },
        { type: String, decorators: [{ type: Optional }, { type: Inject, args: [BASE_PATH,] }] },
        { type: Configuration, decorators: [{ type: Optional }] }
    ]; };
    /** @nocollapse */ UsersService.ngInjectableDef = defineInjectable({ factory: function UsersService_Factory() { return new UsersService(inject(HttpClient), inject(BASE_PATH, 8), inject(Configuration, 8)); }, token: UsersService, providedIn: "root" });
    return UsersService;
}());

/**
 * @fileoverview added by tsickle
 * Generated from: api/api.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/chapter.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/chapterData.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/chapterLocation.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/chapterUpdate.ts
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
 * Generated from: model/deciosionOption.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/decision.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/errorMsg.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/listChapters.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/listCities.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/listNpcs.ts
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
 * Generated from: model/newCityTale.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/newNpc.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/newPlaceTale.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/npc.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/npcData.ts
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
 * Generated from: model/requestDeleteChapter.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestDeleteCity.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestDeleteNpc.ts
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
 * Generated from: model/requestGetChapters.ts
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
 * Generated from: model/requestGetNPC.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestGetNpcs.ts
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
 * Generated from: model/requestNewNpc.ts
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
 * Generated from: model/requestPublishChapter.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestPublishCity.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/requestPublishNpc.ts
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
 * Generated from: model/requestUpdateChapter.ts
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
 * Generated from: model/requestUpdateNpc.ts
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
 * Generated from: model/responseDeleteChapter.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseDeleteCity.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseDeleteNpc.ts
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
 * Generated from: model/responseGetChapters.ts
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
 * Generated from: model/responseGetNPC.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responseGetNpcs.ts
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
 * Generated from: model/responseNewNpc.ts
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
 * Generated from: model/responsePublishChapter.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responsePublishCity.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/responsePublishNpc.ts
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
 * Generated from: model/responseUpdateChapter.ts
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
 * Generated from: model/responseUpdateNpc.ts
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
 * Generated from: model/taleEdition.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */

/**
 * @fileoverview added by tsickle
 * Generated from: model/updateNpcStructure.ts
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

export { LocationsService, StoriesService, UsersService, Configuration, BASE_PATH as ɵa };

//# sourceMappingURL=wos-api.js.map