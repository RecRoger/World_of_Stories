(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/common/http'), require('@angular/core')) :
    typeof define === 'function' && define.amd ? define('wos-api', ['exports', '@angular/common/http', '@angular/core'], factory) :
    (factory((global['wos-api'] = {}),global.ng.common.http,global.ng.core));
}(this, (function (exports,i1,i0) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: variables.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var BASE_PATH = new i0.InjectionToken('basePath');

    /**
     * @fileoverview added by tsickle
     * Generated from: configuration.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var Configuration = /** @class */ (function () {
        function Configuration(configurationParameters) {
            if (configurationParameters === void 0) {
                configurationParameters = {};
            }
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
                var type = contentTypes.find(( /**
                 * @param {?} x
                 * @return {?}
                 */function (x) { return _this.isJsonMime(x); }));
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
                var type = accepts.find(( /**
                 * @param {?} x
                 * @return {?}
                 */function (x) { return _this.isJsonMime(x); }));
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
     * Generated from: api/users.service.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var UsersService = /** @class */ (function () {
        function UsersService(httpClient, basePath, configuration) {
            this.httpClient = httpClient;
            this.basePath = 'http://localhost:3000';
            this.defaultHeaders = new i1.HttpHeaders();
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
                catch (e_1_1) {
                    e_1 = { error: e_1_1 };
                }
                finally {
                    try {
                        if (consumes_1_1 && !consumes_1_1.done && (_a = consumes_1.return))
                            _a.call(consumes_1);
                    }
                    finally {
                        if (e_1)
                            throw e_1.error;
                    }
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
                if (observe === void 0) {
                    observe = 'body';
                }
                if (reportProgress === void 0) {
                    reportProgress = false;
                }
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
                if (observe === void 0) {
                    observe = 'body';
                }
                if (reportProgress === void 0) {
                    reportProgress = false;
                }
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
                if (observe === void 0) {
                    observe = 'body';
                }
                if (reportProgress === void 0) {
                    reportProgress = false;
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
                if (observe === void 0) {
                    observe = 'body';
                }
                if (reportProgress === void 0) {
                    reportProgress = false;
                }
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
                if (observe === void 0) {
                    observe = 'body';
                }
                if (reportProgress === void 0) {
                    reportProgress = false;
                }
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
                if (observe === void 0) {
                    observe = 'body';
                }
                if (reportProgress === void 0) {
                    reportProgress = false;
                }
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
                if (observe === void 0) {
                    observe = 'body';
                }
                if (reportProgress === void 0) {
                    reportProgress = false;
                }
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
            { type: i0.Injectable, args: [{
                        providedIn: 'root'
                    },] }
        ];
        /** @nocollapse */
        UsersService.ctorParameters = function () {
            return [
                { type: i1.HttpClient },
                { type: String, decorators: [{ type: i0.Optional }, { type: i0.Inject, args: [BASE_PATH,] }] },
                { type: Configuration, decorators: [{ type: i0.Optional }] }
            ];
        };
        /** @nocollapse */ UsersService.ngInjectableDef = i0.defineInjectable({ factory: function UsersService_Factory() { return new UsersService(i0.inject(i1.HttpClient), i0.inject(BASE_PATH, 8), i0.inject(Configuration, 8)); }, token: UsersService, providedIn: "root" });
        return UsersService;
    }());

    /**
     * @fileoverview added by tsickle
     * Generated from: api/api.ts
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

    exports.UsersService = UsersService;
    exports.Configuration = Configuration;
    exports.ɵa = BASE_PATH;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=wos-api.umd.js.map