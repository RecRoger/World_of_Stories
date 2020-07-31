import * as express from 'express';
import { placesController } from '../controllers/places.controller';
import cors from 'cors'

class PlacesRouter {
    constructor(server: express.Application) {
        const router = express.Router();

        router.post('/', cors(), placesController.getCityPlaces);
        router.post('/place', cors(), placesController.getOnePlace);
        router.post('/new', cors(), placesController.savePlace);
        router.post('/delete', cors(), placesController.deletePlace);
        router.post('/publish', cors(), placesController.publishPlace);
        
        router.post('/description/new', cors(), placesController.addPlaceDescription);
        router.post('/description/remove', cors(), placesController.removePlaceDescription);
        router.post('/description/update', cors(), placesController.updatePlaceDescription);
        
        router.post('/entry/new', cors(), placesController.addPlaceEntry);
        router.post('/entry/remove', cors(), placesController.removePlaceEntry);
        router.post('/entry/update', cors(), placesController.updatePlaceEntry);

        server.use('/places', router)
    }
}

export default PlacesRouter;