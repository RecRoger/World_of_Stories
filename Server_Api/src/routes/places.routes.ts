import * as express from 'express';
import { placesController } from '../controllers/places.controller';
import cors from 'cors'

class PlacesRouter {
    constructor(server: express.Express) {
        const router = express.Router();

        router.post('/', cors(), placesController.getCityPlaces);
        router.post('/place', cors(), placesController.getOnePlace);
        router.post('/new', cors(), placesController.savePlace);
        router.post('/delete', cors(), placesController.deletePlace);
        router.post('/publish', cors(), placesController.publishPlace);
        
        router.post('/add_desc', cors(), placesController.addPlaceDescription);
        router.post('/remove_desc', cors(), placesController.removePlaceDescription);
        router.post('/update_desc', cors(), placesController.updatePlaceDescription);
        
        router.post('/add_entry', cors(), placesController.addPlaceEntry);
        router.post('/remove_entry', cors(), placesController.removePlaceEntry);
        router.post('/update_entry', cors(), placesController.updatePlaceEntry);

        server.use('/places', router)
    }
}

export default PlacesRouter;