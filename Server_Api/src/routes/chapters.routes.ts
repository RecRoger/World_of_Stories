import { Request, Response, Router } from 'express';
import { chaptersController } from './../controllers/chapters.controller'

const chaptersRouter: Router = Router();

chaptersRouter.post('/chapters', chaptersController.getAllChapters);
chaptersRouter.post('/update', chaptersController.updateChapter);
chaptersRouter.post('/delete', chaptersController.deleteChapter);
chaptersRouter.post('/publish', chaptersController.publishChapter);
// chaptersRouter.post('/npc', chaptersController.getOneNPC);
// chaptersRouter.post('/add', chaptersController.saveNPC);



export default chaptersRouter;