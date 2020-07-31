import * as express from 'express'
import { chaptersController } from './../controllers/chapters.controller'
import cors from 'cors'

class ChaptersRouter {
    constructor(server: express.Application){
        const router = express.Router();

        router.post('/', cors(), chaptersController.getAllChapters);
        router.post('/chapter', cors(), chaptersController.getChapter);
        router.post('/update', cors(), chaptersController.updateChapter);
        router.post('/delete', cors(), chaptersController.deleteChapter);
        router.post('/publish', cors(), chaptersController.publishChapter);
        // router.post('/npc', cors(), chaptersController.getOneNPC);
        // router.post('/add', cors(), chaptersController.saveNPC);
        

        // router.options('*', cors());

        server.use('/chapters', router)
    }
}

export default ChaptersRouter;
