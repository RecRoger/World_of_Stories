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
const places_controller_1 = require("../controllers/places.controller");
const cors_1 = __importDefault(require("cors"));
class PlacesRouter {
    constructor(server) {
        const router = express.Router();
        router.post('/', cors_1.default(), places_controller_1.placesController.getCityPlaces);
        router.post('/place', cors_1.default(), places_controller_1.placesController.getOnePlace);
        router.post('/new', cors_1.default(), places_controller_1.placesController.savePlace);
        router.post('/delete', cors_1.default(), places_controller_1.placesController.deletePlace);
        router.post('/publish', cors_1.default(), places_controller_1.placesController.publishPlace);
        router.post('/description/new', cors_1.default(), places_controller_1.placesController.addPlaceDescription);
        router.post('/description/remove', cors_1.default(), places_controller_1.placesController.removePlaceDescription);
        router.post('/description/update', cors_1.default(), places_controller_1.placesController.updatePlaceDescription);
        router.post('/entry/new', cors_1.default(), places_controller_1.placesController.addPlaceEntry);
        router.post('/entry/remove', cors_1.default(), places_controller_1.placesController.removePlaceEntry);
        router.post('/entry/update', cors_1.default(), places_controller_1.placesController.updatePlaceEntry);
        server.use('/places', router);
    }
}
exports.default = PlacesRouter;
