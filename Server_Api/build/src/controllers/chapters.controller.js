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
class ChaptersController {
    // get all npcs of a places
    getAllChapters(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('*************** getAllChapters *******************');
                const { id, published } = req.body;
                console.log('> npcId:', id);
                const npcs = yield npcs_model_1.default.findOne({
                    _id: id,
                }, {
                    title: 1,
                    chapters: 1
                }).lean();
                let filterChapters = (npcs) ? npcs.chapters : [];
                console.log('> story name:', npcs && npcs.title);
                if (published && npcs) {
                    filterChapters = (npcs.chapters) ? npcs.chapters.filter(npc => npc.published == true) : [];
                }
                const castChapters = (filterChapters) ? filterChapters.map((c) => (Object.assign({}, c, { id: c._id }))) : null;
                console.log('_____________________________________________________');
                res.json({
                    "data": { "chapters": castChapters }
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
    // updates/add Chapters
    updateChapter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('*************** updateChapter *******************');
                const { chapter } = req.body;
                let setUpdates = {};
                let pullUpdates = {};
                let arrayFilters = null;
                // **** Modificaciones, opcionales
                if (chapter.name) {
                    setUpdates['chapters.$.name'] = chapter.name;
                }
                if (chapter.story) {
                    setUpdates['chapters.$.story'] = chapter.story;
                    if (chapter.author) {
                        setUpdates['chapters.$.author'] = chapter.author;
                        setUpdates['chapters.$.writeDate'] = new Date();
                    }
                }
                if (chapter.item) {
                    setUpdates['chapters.$.item'] = chapter.item;
                }
                if (chapter.endLocation) {
                    setUpdates['chapters.$.endLocation'] = chapter.endLocation;
                }
                // editar las decisiones
                if (chapter.usersDecisions) {
                    setUpdates['chapters.$.usersDecisions.decisionType'] = chapter.usersDecisions.decisionType;
                    setUpdates['chapters.$.usersDecisions.amount'] = chapter.usersDecisions.amount;
                    setUpdates['chapters.$.usersDecisions.item'] = chapter.usersDecisions.item;
                    pullUpdates['chapters.$.usersDecisions.options'] = [];
                    // las Decisiones generan otros capitulos 
                    for (const option of (chapter.usersDecisions.options)) {
                        // la edicione tiene id, significa que edito existente.
                        if (option["id"]) {
                            setUpdates['chapters.$.usersDecisions.option.$[elem].description'] = option.description;
                            setUpdates['chapters.$.usersDecisions.option.$[elem].name'] = option.name;
                            setUpdates['chapters.$.usersDecisions.option.$[elem].value'] = option.value;
                            arrayFilters = { arrayFilters: [{ "elem._id": option.id }] };
                        }
                        else {
                            console.log('> new option');
                            // la decision no tiene id, agrego nueva decision y capitulo.
                            if (!option.value) {
                                const newChapter = yield npcs_model_1.default.updateOne({ "chapters._id": chapter.id }, {
                                    $push: {
                                        chapters: [{
                                                name: '',
                                                story: '',
                                                published: false,
                                                writeDate: new Date() // Fecha de creacion
                                            }]
                                    }
                                });
                                const npc = yield npcs_model_1.default.findOne({ "chapters._id": chapter.id }, { chapters: 1 }).lean();
                                if (npc && npc.chapters) {
                                    option.value = npc.chapters[npc.chapters.length - 1]._id;
                                }
                                console.log('> new chapterId: ', option.value);
                            }
                            pullUpdates['chapters.$.usersDecisions.options'].push({
                                "description": option.description,
                                "name": option.name,
                                "value": option.value,
                                "published": option.published,
                                "removeItem": option.removeItem
                            });
                        }
                    }
                }
                const updates = {};
                if (Object.keys(setUpdates).length > 0)
                    updates['$set'] = setUpdates;
                if (Object.keys(pullUpdates).length > 0)
                    updates['$push'] = pullUpdates;
                const npcs = yield npcs_model_1.default.updateOne({ "chapters._id": chapter.id }, updates, arrayFilters).lean();
                const findChapter = yield npcs_model_1.default.findOne({ "chapters._id": chapter.id }, {
                    "chapters": 1
                }).lean();
                // console.log("> capitulos", findChapter)
                const castChapter = findChapter && findChapter.chapters ? findChapter.chapters.find(c => c._id === chapter.id) : null;
                res.json({
                    "data": { chapter: castChapter ? Object.assign({}, castChapter, { id: castChapter._id }) : null }
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
    // delete Chapter
    deleteChapter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** deleteChapter *******************');
                const { id } = req.body;
                console.log('> placeId: ' + id);
                const choices = yield npcs_model_1.default.updateOne({ "chapters._id": id }, {
                    $pull: {
                        "chapters.$[elem].usersDecisions.options": {
                            value: id
                        }
                    }
                }, { arrayFilters: [{ "elem._id": { $nin: [id] } }] }).lean();
                console.log('> choices edition:', choices);
                const edition = yield npcs_model_1.default.updateOne({ "chapters._id": id }, {
                    $pull: {
                        chapters: {
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
    // publicar Chapter
    publishChapter(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** publishChapter *******************');
                const { id, published } = req.body;
                console.log('> chapterId: ' + id);
                console.log('> Publish Status: ' + published);
                const chapterEdition = yield npcs_model_1.default.updateOne({ "chapters._id": id }, {
                    $set: {
                        "chapters.$.published": published,
                        "chapters.$.publishDate": (published) ? new Date() : null
                    }
                }).lean();
                console.log('> chapterEdition: ', chapterEdition);
                const edition = yield npcs_model_1.default.updateOne({ "chapters._id": id }, {
                    $set: {
                        "chapters.$[elem].usersDecisions.$[choice].published": published
                    }
                }, {
                    arrayFilters: [
                        {
                            "elem._id": { $nin: [id] }
                        },
                        {
                            "choice.value": id
                        }
                    ]
                });
                console.log('> response: ' + ((edition.nModified) ? 'OK' : 'not Found'));
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
exports.chaptersController = new ChaptersController();
