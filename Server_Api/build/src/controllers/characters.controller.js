"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = __importDefault(require("../schemas/users.model"));
class CharactersController {
    // get All Characters of an User
    getUserCharacters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('*************** getUserCharacters *******************');
                const { id } = req.body;
                const user = yield users_model_1.default.findOne({ _id: id }, {
                    "characters": 1
                    // description: 0,
                    // travel: 0
                }).lean();
                let characters = (user && user.characters) ? user.characters : [];
                const castChars = characters.map(character => {
                    return Object.assign({}, character, { "id": character._id });
                });
                console.log('_____________________________________________________');
                res.json({
                    "data": { "characters": castChars }
                });
            }
            catch (err) {
                console.log('Error ---->', err);
                console.log('_____________________________________________________');
                res.json({
                    "error": err
                });
            }
        });
    }
    // New Character
    newCharacter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('*************** newCharacter *******************');
                const { userId, name } = req.body;
                console.log('> userId: ' + userId);
                const edition = yield users_model_1.default.updateOne({ _id: userId }, {
                    $push: {
                        characters: [{
                                name: name,
                                money: 1000,
                                items: [],
                                fragmentsRead: [],
                                animations: true
                            }]
                    }
                }).lean();
                const user = yield users_model_1.default.findOne({ _id: userId }, {
                    "characters": 1
                }).lean();
                const character = (user && user.characters) ? user.characters.slice(-1)[0] : null;
                const castChar = character ? Object.assign({}, character, { id: character._id }) : null;
                console.log('> response: ' + ((character) ? character.name : 'Not Found'));
                console.log('_____________________________________________________');
                console.log('_____________________________________________________');
                res.json({
                    "data": { "character": castChar }
                });
            }
            catch (err) {
                console.log('Error ---->', err);
                console.log('_____________________________________________________');
                res.json({
                    "error": err
                });
            }
        });
    }
    // Add readFragment to an Character
    setCharacterFragmentRead(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('*************** setCharacterFragmentRead *******************');
                const { characterId, fragmentId } = req.body;
                console.log('> characterId: ' + characterId);
                const edition = yield users_model_1.default.updateOne({ "characters._id": characterId }, {
                    $push: {
                        "characters.$.fragmentsRead": [fragmentId]
                    }
                }).lean();
                console.log('> response: ' + ((edition && edition.nModified) ? 'OK' : 'Not Found'));
                console.log('_____________________________________________________');
                console.log('_____________________________________________________');
                res.json({
                    "data": (edition && edition.nModified) ? 'OK' : 'error'
                });
            }
            catch (err) {
                console.log('Error ---->', err);
                console.log('_____________________________________________________');
                res.json({
                    "error": err
                });
            }
        });
    }
    // Update Character
    updateCharacter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('*************** updateCharacter *******************');
                const { character } = req.body;
                console.log('> characterId: ' + character.id);
                let setUpdates = {};
                if (character.name) {
                    setUpdates['characters.$.name'] = character.name;
                }
                if (character.location) {
                    setUpdates['characters.$.location'] = character.location;
                }
                if (character.money) {
                    setUpdates['characters.$.money'] = character.money;
                }
                if (character.items) {
                    setUpdates['characters.$.items'] = character.items;
                }
                if (character.animations || character.animations === false) {
                    setUpdates['characters.$.animations'] = character.animations;
                }
                const updates = {};
                if (Object.keys(setUpdates).length > 0)
                    updates['$set'] = setUpdates;
                const edition = yield users_model_1.default.updateOne({ "characters._id": character.id }, updates).lean();
                const findCharacter = yield users_model_1.default.findOne({ "characters._id": character.id }, {
                    "characters": 1
                }).lean();
                // console.log("> capitulos", findCharacter)
                const castCharacter = (findCharacter && findCharacter.characters) ? findCharacter.characters.find(c => c._id == character.id) : null;
                console.log('> response: ', castCharacter && castCharacter.name);
                console.log('_____________________________________________________');
                res.json({
                    "data": { character: castCharacter ? Object.assign({}, castCharacter, { id: castCharacter._id }) : null }
                });
            }
            catch (err) {
                console.log('Error ---->', err);
                console.log('_____________________________________________________');
                res.json({
                    "error": err
                });
            }
        });
    }
    // Update Character
    deleteCharacter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('*************** deleteCharacter *******************');
                const { id } = req.body;
                console.log('> characterId: ' + id);
                const edition = yield users_model_1.default.updateOne({ "characters._id": id }, {
                    $pull: {
                        characters: {
                            _id: id
                        }
                    }
                });
                console.log('===================== ' + ((edition.nModified) ? 'OK' : 'not Found') + ' ======================');
                console.log('_____________________________________________________');
                res.json({
                    "data": (edition.nModified) ? 'OK' : 'error'
                });
            }
            catch (err) {
                console.log('Error ---->', err);
                console.log('_____________________________________________________');
                res.json({
                    "error": err
                });
            }
        });
    }
}
exports.charactersController = new CharactersController();
