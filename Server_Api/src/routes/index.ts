import { Router } from 'express';
import { userRouter } from './users.routes.js';
import { citiesRouter } from './cities.routes.js';
import { placesRouter } from './places.routes.js';
// import { charactersRouter } from './characters.routes.js';
// import { npcsRouter } from './npcs.routes.js';
// import { chaptersRouter } from './chapters.routes.js';


const mainRouter = Router();

mainRouter.use('/users', userRouter);
mainRouter.use('/cities', citiesRouter);
mainRouter.use('/places', placesRouter);
// mainRouter.use('/characters', charactersRouter);
// mainRouter.use('/npcs', npcsRouter);
// mainRouter.use('/chapters', chaptersRouter);


export { mainRouter };