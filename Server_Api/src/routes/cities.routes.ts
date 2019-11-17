import { Request, Response, Router } from 'express';
import { citiesController } from './../controllers/cities.controller'

const citiesRouter: Router = Router();

citiesRouter.post('/cities', citiesController.getAllCities);
citiesRouter.post('/city', citiesController.getOneCity);
citiesRouter.post('/add', citiesController.saveCity);
citiesRouter.post('/delete', citiesController.deleteCity);
citiesRouter.post('/publish', citiesController.publishCity);

citiesRouter.post('/add_desc', citiesController.addCityDescription);
citiesRouter.post('/remove_desc', citiesController.removeCityDescription);
citiesRouter.post('/update_desc', citiesController.updateCityDescription);

citiesRouter.post('/add_travel', citiesController.addCityTravel);
citiesRouter.post('/remove_travel', citiesController.removeCityTravel);
citiesRouter.post('/update_travel', citiesController.updateCityTravel);


export default citiesRouter;