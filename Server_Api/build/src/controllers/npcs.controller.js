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
const npcs_model_1 = __importDefault(require("../schemas/npcs.model"));
const cities_model_1 = __importDefault(require("../schemas/cities.model"));
class NpcsController {
    // get all npcs of a places
    getAllNPCs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('*************** getAllNPCs *******************');
                const { placeId, published } = req.body;
                console.log('> placeId: ', placeId);
                const city = yield cities_model_1.default.findOne({
                    "places._id": placeId
                }, {
                    places: 1
                }).lean();
                const place = city.places.find((p) => p._id == placeId);
                let filterNpcs = [];
                if (city && place) {
                    const ids = place.events;
                    console.log('> places ids: ', ids);
                    const npcs = yield npcs_model_1.default.find({
                        _id: { $in: ids },
                    }, {
                        // decision:_id
                        name: 1,
                        npcType: 1,
                        author: 1,
                        published: 1,
                        writeDate: 1,
                        publishDate: 1,
                    }).lean();
                    filterNpcs = npcs || [];
                    if (published) {
                        filterNpcs = npcs.filter(npc => npc.published == true);
                    }
                }
                console.log('_____________________________________________________');
                res.json({
                    "data": { "npcs": filterNpcs.map((npc) => (Object.assign({}, npc, { id: npc._id }))) }
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
    // get get complete NPC y ID
    getOneNPC(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('*************** getOneNPC **************************');
                console.log('> npcId: ' + req.body.id);
                const { id, published } = req.body;
                const filters = (published) ? { _id: id, published: true } : { _id: id };
                const npc = yield npcs_model_1.default.findById(filters, {
                    "chapters": 0
                    // "chapters.description": 0,
                    // "chapters.story": 0,
                    // "chapters.usersDecisions": 0,
                    // "chapters.itemsDecisions": 0,
                    // considerar
                    // tipo de "chapters.batalla": 0,
                    // "chapters.enemigo": 0,
                    // "chapters.defeat": 0,
                    // "chapters.item": 0,
                }).lean();
                const castNpc = npc ? Object.assign({}, npc, { id: npc._id, description: npc.description ? Object.assign({}, npc.description, { id: npc.description._id }) : {}, meeting: npc.meeting ? Object.assign({}, npc.meeting, { id: npc.meeting._id }) : {}, rejected: npc.rejected ? Object.assign({}, npc.rejected, { id: npc.rejected._id }) : {} }) : null;
                console.log('> response:' + ((npc) ? npc.name : npc));
                console.log('_____________________________________________________');
                res.json({
                    "data": { "npc": castNpc }
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
    // save new NPC
    saveNPC(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('*************** saveNPC **************************');
                const { placeId, npc } = req.body;
                console.log('> placeId: ', placeId);
                const newNpc = new npcs_model_1.default({
                    name: npc.name,
                    npcType: npc.npcType,
                    description: {
                        tale: npc.description,
                        author: npc.author,
                        published: false
                    },
                    meeting: {
                        tale: npc.meeting,
                        author: npc.author,
                        published: false
                    },
                    decision: {
                        decisionType: npc.decision.decisionType,
                        amount: npc.decision.amount,
                        item: npc.decision.item,
                        options: [{
                                name: npc.decision.options[0].name,
                                description: npc.decision.options[0].description,
                                value: npc.decision.options[0].value,
                                published: npc.decision.options[0].published,
                                removeItem: npc.decision.options[0].removeItem
                            }, {
                                name: npc.decision.options[1].name,
                                description: npc.decision.options[1].description,
                                value: npc.decision.options[1].value,
                                published: npc.decision.options[1].published,
                                removeItem: npc.decision.options[1].removeItem
                            }]
                    },
                    rejected: {
                        tale: npc.rejected,
                        author: npc.author,
                        published: false
                    },
                    items: [],
                    title: npc.title,
                    chapters: [{
                            name: '',
                            story: [],
                            published: false,
                            writeDate: new Date() // Fecha de creacion
                        }],
                    author: npc.author,
                    published: false,
                    writeDate: new Date() // Fecha de creacion
                });
                yield newNpc.save();
                console.log('> newNpcId: ', newNpc._id);
                const placeEdition = yield cities_model_1.default.updateOne({ "places._id": placeId }, {
                    $push: {
                        "places.$.events": [newNpc._id]
                    }
                }).lean();
                console.log('> placeEdition: ', placeEdition);
                const npcSearch = yield npcs_model_1.default.findOne({ _id: newNpc._id }).lean();
                const castNpc = npcSearch ? Object.assign({}, npcSearch, { id: npcSearch._id, description: npcSearch.description ? Object.assign({}, npcSearch.description, { id: npcSearch.description._id }) : {}, meeting: npcSearch.meeting ? Object.assign({}, npcSearch.meeting, { id: npcSearch.meeting._id }) : {}, chapters: npcSearch && npcSearch.chapters ? [Object.assign({}, npcSearch.chapters[0], { id: npcSearch.chapters[0]._id })] : [] }) : null;
                console.log('> response:' + ((castNpc) ? (castNpc).name : npc));
                console.log('_____________________________________________________');
                res.json({
                    "data": { "npc": castNpc }
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
    // delete NPCs
    deleteNPCs(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** deleteNPCs *******************');
                const { npcId, placeId } = req.body;
                console.log('> placeId: ', placeId);
                console.log('> npcId: ', npcId);
                const edition = yield npcs_model_1.default.deleteOne({
                    _id: npcId
                });
                const city = yield cities_model_1.default.updateOne({ "places._id": placeId }, {
                    $pull: {
                        "places.$.events": npcId
                    }
                });
                console.log('> response: ' + ((edition.ok) ? 'OK' : 'not Found'));
                console.log('_____________________________________________________');
                res.json({
                    "data": (edition.ok) ? 'OK' : 'error'
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
    // publicar NPC
    publishNPC(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** publishNPC *******************');
                const { id, published } = req.body;
                console.log('> npcId: ' + id);
                console.log('> Publish Status: ' + published);
                const edition = yield npcs_model_1.default.updateOne({ _id: id }, {
                    published: published,
                    publishDate: (published) ? new Date() : null
                });
                console.log('> repsonse:' + ((edition.nModified) ? 'OK' : 'not Found'));
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
    // updates NPC
    updateNPC(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** updateNPC *******************');
                const { id, npc } = req.body;
                console.log('> npcId: ' + id);
                let updates = {};
                if (npc.name)
                    updates.name = npc.name;
                if (npc.description) {
                    updates['description.tale'] = npc.description;
                    updates['description.author'] = npc.author;
                }
                if (npc.meeting) {
                    updates['meeting.tale'] = npc.meeting;
                    updates['meeting.author'] = npc.author;
                }
                if (npc.decision) {
                    updates['decision.decisionType'] = npc.decision.decisionType;
                    updates['decision.amount'] = npc.decision.amount;
                    updates['decision.item'] = npc.decision.item;
                    updates['decision.options'] = [{
                            name: npc.decision.options[0].name,
                            description: npc.decision.options[0].description,
                            value: npc.decision.options[0].value,
                            published: npc.decision.options[0].published,
                            removeItem: npc.decision.options[0].removeItem
                        }, {
                            name: npc.decision.options[1].name,
                            description: npc.decision.options[1].description,
                            value: npc.decision.options[1].value,
                            published: npc.decision.options[1].published,
                            removeItem: npc.decision.options[1].removeItem
                        }];
                }
                ;
                if (npc.items)
                    updates.items = npc.items;
                if (npc.rejected) {
                    updates['rejected.tale'] = npc.rejected;
                    updates['rejected.author'] = npc.author;
                }
                if (npc.title)
                    updates.title = npc.title;
                updates.writeDate = new Date();
                const edition = yield npcs_model_1.default.updateOne({ _id: id }, {
                    $set: updates
                }).lean();
                console.log('> npc edition: ', edition);
                const editedNpc = yield npcs_model_1.default.findById({ _id: id }, {
                    "chapters": 0
                }).lean();
                const castNpc = editedNpc ? Object.assign({}, editedNpc, { id: editedNpc._id, description: editedNpc.description ? Object.assign({}, editedNpc.description, { id: editedNpc.description._id }) : {}, meeting: editedNpc.meeting ? Object.assign({}, editedNpc.meeting, { id: editedNpc.meeting._id }) : {} }) : null;
                console.log('> response:' + ((editedNpc) ? editedNpc.name : editedNpc));
                console.log('_____________________________________________________');
                res.json({
                    "data": { "npc": castNpc }
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
exports.npcsController = new NpcsController();
