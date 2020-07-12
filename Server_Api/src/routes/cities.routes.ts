import * as express from 'express';
import { citiesController } from './../controllers/cities.controller'

class CitiesRouter {
    constructor(server: express.Express) {
        const router = express.Router();
        
        router.post('/', citiesController.getAllCities);
        router.post('/city', citiesController.getOneCity);
        
        
        router.post('/add', citiesController.saveCity);
        router.post('/delete', citiesController.deleteCity);
        router.post('/publish', citiesController.publishCity);
        
        router.post('/add_desc', citiesController.addCityDescription);
        router.post('/remove_desc', citiesController.removeCityDescription);
        router.post('/update_desc', citiesController.updateCityDescription);
        
        router.post('/add_travel', citiesController.addCityTravel);
        router.post('/remove_travel', citiesController.removeCityTravel);
        router.post('/update_travel', citiesController.updateCityTravel);
        
        server.use('/cities', router)
    }
}



export default CitiesRouter;