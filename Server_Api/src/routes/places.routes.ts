import { Request, Response, Router } from 'express';
import { placesController } from '../controllers/places.controller';

const placesRouter: Router = Router();

placesRouter.post('/places', placesController.getCityPlaces);
placesRouter.post('/place', placesController.getOnePlace);
placesRouter.post('/add', placesController.savePlace);
placesRouter.post('/delete', placesController.deletePlace);
placesRouter.post('/publish', placesController.publishPlace);

placesRouter.post('/add_desc', placesController.addPlaceDescription);
placesRouter.post('/remove_desc', placesController.removePlaceDescription);
placesRouter.post('/update_desc', placesController.updatePlaceDescription);

placesRouter.post('/add_entry', placesController.addPlaceEntry);
placesRouter.post('/remove_entry', placesController.removePlaceEntry);
placesRouter.post('/update_entry', placesController.updatePlaceEntry);


export default placesRouter;