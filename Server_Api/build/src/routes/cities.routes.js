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
const cities_controller_1 = require("./../controllers/cities.controller");
const cors_1 = __importDefault(require("cors"));
class CitiesRouter {
    constructor(server) {
        const router = express.Router();
        router.post('/', cors_1.default(), cities_controller_1.citiesController.getAllCities);
        router.post('/city', cors_1.default(), cities_controller_1.citiesController.getOneCity);
        router.post('/new', cors_1.default(), cities_controller_1.citiesController.saveCity);
        router.post('/delete', cors_1.default(), cities_controller_1.citiesController.deleteCity);
        router.post('/publish', cors_1.default(), cities_controller_1.citiesController.publishCity);
        router.post('/description/new', cors_1.default(), cities_controller_1.citiesController.addCityDescription);
        router.post('/description/remove', cors_1.default(), cities_controller_1.citiesController.removeCityDescription);
        router.post('/description/update', cors_1.default(), cities_controller_1.citiesController.updateCityDescription);
        router.post('/travel/new', cors_1.default(), cities_controller_1.citiesController.addCityTravel);
        router.post('/travel/remove', cors_1.default(), cities_controller_1.citiesController.removeCityTravel);
        router.post('/travel/update', cors_1.default(), cities_controller_1.citiesController.updateCityTravel);
        server.use('/cities', router);
    }
}
exports.default = CitiesRouter;
