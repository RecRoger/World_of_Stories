"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const UsersSchema = new mongoose_1.Schema({
    username: String,
    password: String,
    rol: [String],
    characters: [{
            name: String,
            location: {
                cityId: String,
                placeId: String,
                npcId: String,
                chapterId: String,
            },
            money: Number,
            items: [String],
            fragmentsRead: [String]
        }]
});
exports.default = mongoose_1.model('user', UsersSchema);
