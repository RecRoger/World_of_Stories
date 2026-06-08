import { Router } from 'express';
import { addPlaceDescription, addPlaceEntry, deletePlace, getCityPlaces, getOnePlace, publishPlace, removePlaceDescription, removePlaceEntry, savePlace, updatePlaceDescription, updatePlaceEntry } from '../controllers/places.controller.js';

const placesRouter = Router();

placesRouter.get('/city/:cityId', getCityPlaces);
placesRouter.get('/:placeId', getOnePlace);

placesRouter.post('/:cityId', savePlace);
placesRouter.patch('/places/:placeId/publish', publishPlace);
placesRouter.delete('/places/:placeId', deletePlace);

placesRouter.put('/:placeId/description', addPlaceDescription);
placesRouter.patch('/:placeId/description', updatePlaceDescription);
placesRouter.delete('/:placeId/description/:taleId', removePlaceDescription);

placesRouter.put('/:placeId/entry', addPlaceEntry);
placesRouter.patch('/:placeId/entry', updatePlaceEntry);
placesRouter.delete('/:placeId/entry/:taleId', removePlaceEntry);

export { placesRouter };