import * as express from 'express'
import { chaptersController } from './../controllers/chapters.controller'
// import cors from 'cors'

class ChaptersRouter {
    constructor(server: express.Express){
        const router = express.Router();

        router.post('/chapters', chaptersController.getAllChapters);
        router.post('/update', chaptersController.updateChapter);
        router.post('/delete', chaptersController.deleteChapter);
        router.post('/publish', chaptersController.publishChapter);
        // router.post('/npc', chaptersController.getOneNPC);
        // router.post('/add', chaptersController.saveNPC);
        

        // router.options('*', cors());

        server.use('/chapters', router)
    }
}

export default ChaptersRouter;
