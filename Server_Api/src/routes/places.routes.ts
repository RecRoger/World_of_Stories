import * as express from 'express';
import { placesController } from '../controllers/places.controller';


class PlacesRouter {
    constructor(server: express.Express) {
        const router = express.Router();

        router.post('/', placesController.getCityPlaces);
        router.post('/place', placesController.getOnePlace);
        router.post('/add', placesController.savePlace);
        router.post('/delete', placesController.deletePlace);
        router.post('/publish', placesController.publishPlace);
        
        router.post('/add_desc', placesController.addPlaceDescription);
        router.post('/remove_desc', placesController.removePlaceDescription);
        router.post('/update_desc', placesController.updatePlaceDescription);
        
        router.post('/add_entry', placesController.addPlaceEntry);
        router.post('/remove_entry', placesController.removePlaceEntry);
        router.post('/update_entry', placesController.updatePlaceEntry);

        server.use('/places', router)
    }
}

export default PlacesRouter;