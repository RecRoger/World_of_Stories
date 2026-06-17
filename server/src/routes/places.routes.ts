import { Router } from 'express';
import { addPlaceDescription, addPlaceEntry, deletePlace, getCityPlaces, getOnePlace, publishPlace, removePlaceDescription, removePlaceEntry, savePlace, updatePlace, updatePlaceDescription, updatePlaceEntry } from '../controllers/places.controller.js';

const PlacesRouter = Router();

PlacesRouter.route('/city/:cityId')
  .get(getCityPlaces)
  .post(savePlace);

PlacesRouter.route('/:placeId')
  .get(getOnePlace)
  .patch(updatePlace)
  .delete(deletePlace);
PlacesRouter.patch('/:placeId/publish', publishPlace);


PlacesRouter.route('/:placeId/description')
  .put(addPlaceDescription)
  .patch(updatePlaceDescription);
PlacesRouter.delete('/:placeId/description/:taleId', removePlaceDescription);


PlacesRouter.route('/:placeId/entry')
  .put(addPlaceEntry)
  .patch(updatePlaceEntry);
PlacesRouter.delete('/:placeId/entry/:taleId', removePlaceEntry);


export { PlacesRouter };