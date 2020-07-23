"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_1 = require("@angular/common/http");
/**
* CustomHttpUrlEncodingCodec
* Fix plus sign (+) not encoding, so sent as blank space
* See: https://github.com/angular/angular/issues/11058#issuecomment-247367318
*/
class CustomHttpUrlEncodingCodec extends http_1.HttpUrlEncodingCodec {
    encodeKey(k) {
        k = super.encodeKey(k);
        return k.replace(/\+/gi, '%2B');
    }
    encodeValue(v) {
        v = super.encodeValue(v);
        return v.replace(/\+/gi, '%2B');
    }
}
exports.CustomHttpUrlEncodingCodec = CustomHttpUrlEncodingCodec;
