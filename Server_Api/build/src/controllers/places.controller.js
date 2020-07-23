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
const cities_model_1 = __importDefault(require("../schemas/cities.model"));
class PlacesController {
    // get all places of a city
    getCityPlaces(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('*************** getCityPlaces *******************');
                const { cityId, published } = req.body;
                const cities = yield cities_model_1.default.findOne({ _id: cityId }, {
                    description: 0,
                    travel: 0,
                }).lean();
                let places = (cities) ? cities.places : [];
                const castPlaecs = places.map(city => {
                    city.description = city.description.map(t => (Object.assign({}, t, { id: t._id })));
                    city.entry = city.entry.map(t => (Object.assign({}, t, { id: t._id })));
                    return Object.assign({}, city, { id: city._id });
                });
                console.log('_____________________________________________________');
                if (published)
                    places = places.filter(place => place.published);
                res.json({
                    "data": { "places": castPlaecs }
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
    // get get complete place
    getOnePlace(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('*************** getOnePlace **************************');
                console.log('> placeId: ' + req.body.id);
                const city = yield cities_model_1.default.findOne({ "places._id": req.body.id }, { places: 1 }).lean();
                const places = (city) ? city.places : [];
                const place = places.find(place => place._id == req.body.id);
                const castPlace = place ? Object.assign({}, place, { id: place._id, description: place.description.map(t => (Object.assign({}, t, { id: t._id }))), travel: place.entry.map(t => (Object.assign({}, t, { id: t._id }))) }) : null;
                console.log('> respnse:' + ((place) ? place.name : city));
                console.log('_____________________________________________________');
                res.json({
                    "data": { "place": castPlace }
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
    // save new place in city
    savePlace(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('*************** savePlace **************************');
                const { cityId, userName, name, description, entry } = req.body;
                console.log('> cityId: ' + cityId);
                const edition = yield cities_model_1.default.updateOne({ _id: cityId }, {
                    $push: {
                        places: [{
                                name: name,
                                description: [{
                                        tale: description,
                                        author: userName,
                                        published: false,
                                        writeDate: new Date()
                                    }],
                                entry: [{
                                        tale: entry,
                                        author: userName,
                                        published: false,
                                        writeDate: new Date()
                                    }],
                                events: [],
                                publlished: false
                            }]
                    }
                });
                const city = yield cities_model_1.default.findById({ _id: cityId }, {
                    "places": 1
                }).lean();
                const place = (city) ? city.places.slice(1)[0] : null;
                const castPlace = place ? Object.assign({}, place, { id: place._id, description: place.description.map(t => (Object.assign({}, t, { id: t._id }))), travel: place.entry.map(t => (Object.assign({}, t, { id: t._id }))) }) : null;
                console.log('> response: ' + ((place) ? place.name : 'Not Found'));
                console.log('_____________________________________________________');
                res.json({
                    "data": { "place": castPlace }
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
    // delete Place
    deletePlace(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** deletePlace *******************');
                console.log('> placeId: ' + req.body.id);
                const edition = yield cities_model_1.default.updateOne({ "places._id": req.body.id }, {
                    $pull: {
                        places: {
                            _id: req.body.id
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
                res.json({
                    "error": err
                });
            }
        });
    }
    // publicar Place
    publishPlace(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** publishCity *******************');
                const { id, published } = req.body;
                console.log('> placeId: ' + id);
                console.log('> Publish Status: ' + published);
                const edition = yield cities_model_1.default.updateOne({ "places._id": id }, {
                    $set: {
                        "places.$[elem].published": published,
                        "places.$[elem].publishDate": (published) ? new Date() : null
                    }
                }, { arrayFilters: [{ "elem._id": id }] });
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
    // add Place Description
    addPlaceDescription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** addPlaceDescription *******************');
                const { placeId, tale, author } = req.body.description;
                console.log('> placeId ' + placeId);
                const edition = yield cities_model_1.default.updateOne({ "places._id": placeId }, {
                    $push: {
                        "places.$.description": [{
                                tale: tale,
                                author: author,
                                published: false,
                                writeDate: new Date()
                            }]
                    }
                });
                const city = yield cities_model_1.default.findOne({ "places._id": placeId }, {
                    "places.$[elem]": 1
                }, { arrayFilters: [{ "elem._id": placeId }] }).lean();
                const place = (city) ? city.places[0] : null;
                const newDescription = (place) ? place.description.slice(1)[0] : null;
                console.log('> response' + ((newDescription) ? 'OK' : 'Not Found'));
                console.log('_____________________________________________________');
                res.json({
                    "data": newDescription && Object.assign({}, newDescription, { id: newDescription._id })
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
    // remove Place Description
    removePlaceDescription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** removePlaceDescription *******************');
                const { descriptionId } = req.body;
                console.log('> descriptionId ' + descriptionId);
                const edition = yield cities_model_1.default.updateOne({ "places.description._id": descriptionId }, {
                    $pull: {
                        "places.$.description": {
                            _id: descriptionId
                        }
                    }
                });
                console.log('> response ' + ((edition.nModified) ? 'OK' : 'not Found'));
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
    // updates/publish Place Description
    updatePlaceDescription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** updatePlaceDescription *******************');
                let { description } = req.body;
                console.log('> descriptionId: ' + description.id);
                const edition = yield cities_model_1.default.updateOne({ "places.description._id": description.id }, {
                    $set: {
                        "places.$.description.$[elem].tale": description.tale,
                        "places.$.description.$[elem].published": description.published,
                        "places.$.description.$[elem].publishDate": (description.published) ? new Date() : null
                    }
                }, { arrayFilters: [{ "elem._id": description.id }] });
                const city = yield cities_model_1.default.findOne({ "places.description._id": description.id }, {
                    "places.$:": 1
                }).lean();
                const place = (city) ? city.places[0] : null;
                let updatedDescription;
                updatedDescription = place && place.description.find(desc => desc._id == description.id);
                console.log('> response: ' + ((edition.nModified && updatedDescription) ? 'OK' : 'Not Found'));
                console.log('_____________________________________________________');
                res.json({
                    "data": updatedDescription && Object.assign({}, updatedDescription, { id: updatedDescription._id })
                });
            }
            catch (err) {
                res.json({
                    "error": err
                });
            }
        });
    }
    // add Place Entry
    addPlaceEntry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** addPlaceEntry *******************');
                const { placeId, tale, author } = req.body.entry;
                console.log('> placeId ' + placeId);
                const edition = yield cities_model_1.default.updateOne({ "places._id": placeId }, {
                    $push: {
                        "places.$.entry": [{
                                tale: tale,
                                author: author,
                                published: false,
                                writeDate: new Date()
                            }]
                    }
                });
                const city = yield cities_model_1.default.findOne({ "places._id": placeId }, {
                    "places.$[elem]": 1
                }, { arrayFilters: [{ "elem._id": placeId }] }).lean();
                const place = (city) ? city.places[0] : null;
                const newEntry = (place) ? place.entry.slice(1)[0] : null;
                console.log('> response: ' + ((edition.nModified && newEntry) ? 'OK' : 'Not Found'));
                console.log('_____________________________________________________');
                res.json({
                    "data": newEntry && Object.assign({}, newEntry, { id: newEntry._id })
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
    // remove Place Entry
    removePlaceEntry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** removePlaceEntry *******************');
                const { entryId } = req.body;
                console.log('> entryId: ' + entryId);
                const edition = yield cities_model_1.default.updateOne({ "places.entry._id": entryId }, {
                    $pull: {
                        "places.$.entry": {
                            _id: entryId
                        }
                    }
                });
                console.log('> response: ' + ((edition.nModified) ? 'OK' : 'not Found'));
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
    // updates/publish Place Description
    updatePlaceEntry(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** updatePlaceEntry *******************');
                const { entry } = req.body;
                console.log('> entryId ' + entry.id);
                const edition = yield cities_model_1.default.updateOne({ "places.entry._id": entry.id }, {
                    $set: {
                        "places.$.entry.$[elem].tale": entry.tale,
                        "places.$.entry.$[elem].published": entry.published,
                        "places.$.entry.$[elem].publishDate": (entry.published) ? new Date() : null
                    }
                }, { arrayFilters: [{ "elem._id": entry.id }] });
                const city = yield cities_model_1.default.findOne({ "places.entry._id": entry.id }, {
                    "places.$:": 1
                }).lean();
                const place = (city) ? city.places[0] : null;
                let updateEntry;
                updateEntry = (place) ? place.entry.find(enter => enter._id == entry.id) : null;
                console.log('> response: ' + ((edition.nModified && updateEntry) ? 'OK' : 'Not Found'));
                console.log('_____________________________________________________');
                res.json({
                    "data": updateEntry && Object.assign({}, updateEntry, { id: updateEntry._id })
                });
            }
            catch (err) {
                res.json({
                    "error": err
                });
            }
        });
    }
}
exports.placesController = new PlacesController();
