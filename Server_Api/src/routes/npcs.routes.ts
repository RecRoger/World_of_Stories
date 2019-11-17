import { Request, Response, Router } from 'express';
import { npcsController } from './../controllers/npcs.controller'

const npcsRouter: Router = Router();

npcsRouter.post('/npcs', npcsController.getAllNPCs);
npcsRouter.post('/npc', npcsController.getOneNPC);
npcsRouter.post('/add', npcsController.saveNPC);
npcsRouter.post('/delete', npcsController.deleteNPCs);
npcsRouter.post('/publish', npcsController.publishNPC);
npcsRouter.post('/update', npcsController.updateNPC);



export default npcsRouter;