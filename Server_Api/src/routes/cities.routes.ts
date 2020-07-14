import * as express from 'express';
import { citiesController } from './../controllers/cities.controller';
import cors from 'cors';

class CitiesRouter {
    constructor(server: express.Express) {
        const router = express.Router();
        
        router.post('/', cors(), citiesController.getAllCities);
        router.post('/city', cors(), citiesController.getOneCity);
        
        
        router.post('/new', cors(), citiesController.saveCity);
        router.post('/delete', cors(), citiesController.deleteCity);
        router.post('/publish', cors(), citiesController.publishCity);
        


        router.post('/description/new', cors(), citiesController.addCityDescription);
        router.post('/description/remove', cors(), citiesController.removeCityDescription);
        router.post('/description/update', cors(), citiesController.updateCityDescription);
        
        router.post('/travel/new', cors(), citiesController.addCityTravel);
        router.post('/travel/remove', cors(), citiesController.removeCityTravel);
        router.post('/travel/update', cors(), citiesController.updateCityTravel);
        
        server.use('/cities', router)
    }
}



export default CitiesRouter;