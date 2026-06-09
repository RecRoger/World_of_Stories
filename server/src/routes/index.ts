import { Router } from 'express';
import { UsersRouter } from './users.routes.js';
import { CitiesRouter } from './cities.routes.js';
import { PlacesRouter } from './places.routes.js';
import { NpcsRouter } from './npcs.routes.js';
import { ChaptersRouter } from './chapters.routes.js';
// import { charactersRouter } from './characters.routes.js';


const mainRouter = Router();

mainRouter.use('/users', UsersRouter);
mainRouter.use('/cities', CitiesRouter);
mainRouter.use('/places', PlacesRouter);
mainRouter.use('/npcs', NpcsRouter);
mainRouter.use('/chapters', ChaptersRouter);
// mainRouter.use('/characters', charactersRouter);


export { mainRouter };