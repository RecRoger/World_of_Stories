"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const cors_1 = __importDefault(require("cors"));
const characters_controller_1 = require("../controllers/characters.controller");
class CharactersRouter {
    constructor(server) {
        const router = express.Router();
        router.post('/', cors_1.default(), characters_controller_1.charactersController.getUserCharacters);
        router.post('/new', cors_1.default(), characters_controller_1.charactersController.newCharacter);
        router.post('/read', cors_1.default(), characters_controller_1.charactersController.setCharacterFragmentRead);
        router.post('/update', cors_1.default(), characters_controller_1.charactersController.updateCharacter);
        router.post('/delete', cors_1.default(), characters_controller_1.charactersController.deleteCharacter);
        // router.options('*', cors());
        server.use('/characters', router);
    }
}
exports.default = CharactersRouter;
