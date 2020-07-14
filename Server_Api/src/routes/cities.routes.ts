import * as express from 'express';
import { citiesController } from './../controllers/cities.controller';
import cors from 'cors';

class CitiesRouter {
    constructor(server: express.Express) {
        const router = express.Router();
        
        router.post('/', cors(), citiesController.getAllCities);
        router.post('/city', cors(), citiesController.getOneCity);
        
        
        router.post('/add', cors(), citiesController.saveCity);
        router.post('/delete', cors(), citiesController.deleteCity);
        router.post('/publish', cors(), citiesController.publishCity);
        
        router.post('/add_desc', cors(), citiesController.addCityDescription);
        router.post('/remove_desc', cors(), citiesController.removeCityDescription);
        router.post('/update_desc', cors(), citiesController.updateCityDescription);
        
        router.post('/add_travel', cors(), citiesController.addCityTravel);
        router.post('/remove_travel', cors(), citiesController.removeCityTravel);
        router.post('/update_travel', cors(), citiesController.updateCityTravel);
        
        server.use('/cities', router)
    }
}



export default CitiesRouter;