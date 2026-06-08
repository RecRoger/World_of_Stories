import { Router } from 'express';
import { addCityDescription, addCityTravel, deleteCity, getAllCities, getOneCity, publishCity, removeCityDescription, removeCityTravel, saveCity, updateCityDescription, updateCityTravel } from './../controllers/cities.controller.js';

const CitiesRouter = Router();

CitiesRouter.route('/')
  .get(getAllCities)
  .post(saveCity);

CitiesRouter.route('/:id')
  .get(getOneCity)
  .delete(deleteCity);
CitiesRouter.patch('/:id/publish', publishCity);


CitiesRouter.route('/:cityId/description/')
  .put(addCityDescription)
  .patch(updateCityDescription);

CitiesRouter.delete('/:cityId/description/:taleId', removeCityDescription);

CitiesRouter.route('/:cityId/travel/')
  .put(addCityTravel)
  .patch(updateCityTravel);
CitiesRouter.delete('/:cityId/travel/:taleId', removeCityTravel);

export { CitiesRouter };