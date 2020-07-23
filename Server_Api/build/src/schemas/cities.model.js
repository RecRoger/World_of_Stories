"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const CitiesSchema = new mongoose_1.Schema({
    name: String,
    description: [{
            tale: [{
                    text: String,
                    animation: String
                }],
            author: String,
            published: Boolean,
            writeDate: Date,
            publishDate: Date,
        }],
    travel: [{
            tale: [{
                    text: String,
                    animation: String
                }],
            author: String,
            published: Boolean,
            writeDate: Date,
            publishDate: Date,
        }],
    places: [{
            name: String,
            description: [{
                    tale: [{
                            text: String,
                            animation: String
                        }],
                    author: String,
                    published: Boolean,
                    writeDate: Date,
                    publishDate: Date,
                }],
            entry: [{
                    tale: [{
                            text: String,
                            animation: String
                        }],
                    author: String,
                    published: Boolean,
                    writeDate: Date,
                    publishDate: Date,
                }],
            events: [String],
            published: Boolean,
            publishDate: Date
        }],
    published: Boolean,
    publishDate: Date
});
exports.default = mongoose_1.model('city', CitiesSchema);
