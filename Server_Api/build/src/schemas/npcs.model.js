"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const NpcsSchema = new mongoose_1.Schema({
    name: String,
    npcType: String,
    description: {
        tale: [{
                text: String,
                animation: String
            }],
        author: String,
        published: Boolean,
        writeDate: Date,
        publishDate: Date,
    },
    meeting: {
        tale: [{
                text: String,
                animation: String
            }],
        author: String,
        published: Boolean,
        writeDate: Date,
        publishDate: Date,
    },
    decision: {
        decisionType: String,
        amount: Number,
        item: String,
        options: [{
                name: String,
                description: String,
                value: String,
                published: Boolean,
                removeItem: Boolean
            }]
    },
    rejected: {
        tale: [{
                text: String,
                animation: String
            }],
        author: String,
        published: Boolean,
        writeDate: Date,
        publishDate: Date,
    },
    items: [String],
    title: String,
    chapters: [{
            name: String,
            story: [{
                    text: String,
                    animation: String
                }],
            usersDecisions: {
                decisionType: String,
                amount: Number,
                item: String,
                options: [{
                        name: String,
                        description: String,
                        value: String,
                        published: Boolean,
                        removeItem: Boolean
                    }]
            },
            endLocation: {
                locationType: String,
                locationId: String // id del lugar de retorno del capiulo
            },
            items: [String],
            published: Boolean,
            author: String,
            writeDate: Date,
            publishDate: Date
        }],
    published: Boolean,
    author: String,
    writeDate: Date,
    publishDate: Date,
});
exports.default = mongoose_1.model('npcs', NpcsSchema);
