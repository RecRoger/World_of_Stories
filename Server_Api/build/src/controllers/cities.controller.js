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
class CitiesController {
    // get all cities without places
    getAllCities(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('*************** getAllCities *******************');
                const { published } = req.body;
                const filter = (published) ? { published: true } : {};
                const cities = yield cities_model_1.default.find(filter, {
                    places: 0
                }).lean();
                const castCities = cities.map(city => {
                    city.id = city._id;
                    city.description = city.description.map(t => (Object.assign({}, t, { id: t._id })));
                    city.travel = city.travel.map(t => (Object.assign({}, t, { id: t._id })));
                    return city;
                });
                console.log('_____________________________________________________');
                res.json({
                    "data": { "cities": castCities }
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
    // get get complete city
    getOneCity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('*************** getCity **************************');
                console.log('> cityId: ' + req.body.id);
                const city = yield cities_model_1.default.findById({ _id: req.body.id }, {
                    "places.description": 0,
                    "places.entry": 0,
                    "places.events": 0
                }).lean();
                const castCity = city ? Object.assign({}, city, { id: city._id, description: city.description.map(t => (Object.assign({}, t, { id: t._id }))), travel: city.travel.map(t => (Object.assign({}, t, { id: t._id }))), places: city.places.map(t => (Object.assign({}, t, { id: t._id }))) }) : null;
                console.log('> response:' + ((city) ? city.name : city));
                console.log('_____________________________________________________');
                res.json({
                    "data": { "city": castCity }
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
    // save new City
    saveCity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('*************** newCity **************************');
                const { userName, name, description, travel } = req.body;
                const newCity = new cities_model_1.default({
                    name: name,
                    description: [{
                            tale: description,
                            author: userName,
                            writeDate: new Date(),
                            published: false
                        }],
                    travel: [{
                            tale: travel,
                            author: userName,
                            writeDate: new Date(),
                            published: false
                        }],
                    places: [],
                    published: false
                });
                yield newCity.save();
                const city = yield cities_model_1.default.findOne({ _id: newCity._id }).lean();
                const castCity = city ? Object.assign({}, city, { id: city._id, description: city.description.map(t => (Object.assign({}, t, { id: t._id }))), travel: city.travel.map(t => (Object.assign({}, t, { id: t._id }))) }) : null;
                console.log('> response: ' + ((city) ? city.name : city));
                console.log('_____________________________________________________');
                res.json({
                    "data": { "city": castCity }
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
    // delete City
    deleteCity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** deleteCity *******************');
                console.log('> cityId: ' + req.body.id);
                const edition = yield cities_model_1.default.deleteOne({
                    _id: req.body.id
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
    // publicar City
    publishCity(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** publishCity *******************');
                const { id, published } = req.body;
                console.log('> cityId: ' + id);
                console.log('> Publish Status: ' + published);
                const edition = yield cities_model_1.default.updateOne({ _id: id }, {
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
    // add City Description
    addCityDescription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** addCityDescription *******************');
                const { cityId, tale, author } = req.body.description;
                console.log('> cityId ' + cityId);
                const edition = yield cities_model_1.default.updateOne({ _id: cityId }, {
                    $push: {
                        description: [{
                                tale: tale,
                                author: author,
                                published: false,
                                writeDate: new Date()
                            }]
                    }
                });
                const city = yield cities_model_1.default.findById({ _id: cityId }, {
                    "description": 1
                }).lean();
                const descriptions = (city) ? city.description : null;
                const description = (descriptions) ? descriptions.slice(-1)[0] : null;
                console.log('> response: ' + ((description) ? 'OK' : 'Not Found'));
                console.log('_____________________________________________________');
                res.json({
                    "data": description && Object.assign({}, description, { id: description._id })
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
    // remove City Description
    removeCityDescription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** removeCityDescription *******************');
                const { descriptionId } = req.body;
                console.log('> descriptionId ' + descriptionId);
                const edition = yield cities_model_1.default.updateOne({ "description._id": descriptionId }, {
                    $pull: {
                        description: {
                            _id: descriptionId
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
    // updates/publish City Description
    updateCityDescription(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** updateCityDescription *******************');
                let { description } = req.body;
                console.log('> descriptionId: ' + description.id);
                const edition = yield cities_model_1.default.updateOne({ "description._id": description.id }, {
                    $set: {
                        "description.$[elem].tale": description.tale,
                        "description.$[elem].published": description.published,
                        "description.$[elem].publishDate": (description.published) ? new Date() : null
                    }
                }, { arrayFilters: [{ "elem._id": description.id }] });
                const city = yield cities_model_1.default.findOne({ "description._id": description.id }, {
                    "description.$[elem]": 1
                }, { arrayFilters: [{ "elem._id": description.id }] }).lean();
                const updatedDescription = (city) ? city.description[0] : null;
                console.log('> response:' + ((updatedDescription) ? 'OK' : 'Not Found'));
                console.log('_____________________________________________________');
                res.json({
                    "data": updatedDescription && Object.assign({}, updatedDescription, { id: updatedDescription._id })
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
    // add City Travel
    addCityTravel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** addCityTravel *******************');
                const { cityId, tale, author } = req.body.travel;
                console.log('> cityId ' + cityId);
                const edition = yield cities_model_1.default.updateOne({ _id: cityId }, {
                    $push: {
                        travel: [{
                                tale: tale,
                                author: author,
                                published: false,
                                writeDate: new Date()
                            }]
                    }
                });
                const city = yield cities_model_1.default.findById({ _id: cityId }, {
                    "travel": 1
                }).lean();
                const travels = (city) ? city.travel : null;
                const travel = (travels) ? travels.slice(-1)[0] : null;
                console.log('> response: ' + ((travel) ? 'OK' : 'Not Found'));
                console.log('_____________________________________________________');
                res.json({
                    "data": travel && Object.assign({}, travel, { id: travel._id })
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
    // remove City Travel
    removeCityTravel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** removeCityTravel *******************');
                const { travelId } = req.body;
                console.log('> travelId: ' + travelId);
                const edition = yield cities_model_1.default.updateOne({ "travel._id": travelId }, {
                    $pull: {
                        travel: {
                            _id: travelId
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
    // updates/publish City Travel
    updateCityTravel(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** updateCityTravel *******************');
                const { travel } = req.body;
                const id = travel.id;
                console.log('> travelId: ' + travel.id);
                const edition = yield cities_model_1.default.updateOne({ "travel._id": travel.id }, {
                    $set: {
                        "travel.$[elem].tale": travel.tale,
                        "travel.$[elem].published": travel.published,
                        "travel.$[elem].publishDate": (travel.published) ? new Date() : null
                    }
                }, { arrayFilters: [{ "elem._id": travel.id }] });
                const city = yield cities_model_1.default.findOne({ "travel._id": travel.id }, {
                    "travel.$[elem]": 1
                }, { arrayFilters: [{ "elem._id": travel.id }] }).lean();
                const updatedTravel = (city) ? city.travel[0] : null;
                console.log('> response: ' + ((updatedTravel) ? 'OK' : 'Not Found'));
                console.log('_____________________________________________________');
                res.json({
                    "data": updatedTravel && Object.assign({}, updatedTravel, { id: updatedTravel._id })
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
exports.citiesController = new CitiesController();
