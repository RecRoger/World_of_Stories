import { Router } from 'express';
import { addCityDescription, addCityTravel, deleteCity, getAllCities, getOneCity, publishCity, removeCityDescription, removeCityTravel, saveCity, updateCityDescription, updateCityTravel } from './../controllers/cities.controller.js';

const citiesRouter = Router();

citiesRouter.get('/', getAllCities);
citiesRouter.post('/', saveCity);

citiesRouter.get('/:id', getOneCity);
citiesRouter.delete('/:id', deleteCity);
citiesRouter.patch('/:id/publish', publishCity);

citiesRouter.put('/:cityId/description/', addCityDescription);
citiesRouter.patch('/:cityId/description/', updateCityDescription);
citiesRouter.delete('/:cityId/description/:taleId', removeCityDescription);

citiesRouter.put('/:cityId/travel/', addCityTravel);
citiesRouter.patch('/:cityId/travel/', updateCityTravel);
citiesRouter.delete('/:cityId/travel/:taleId', removeCityTravel);

export { citiesRouter };