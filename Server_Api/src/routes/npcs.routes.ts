import * as express from 'express'
import { npcsController } from './../controllers/npcs.controller'
import cors from 'cors'

class NpcsRouter {
    constructor(server: express.Express){
        const router = express.Router();

        router.post('/npcs', cors(), npcsController.getAllNPCs);
        router.post('/npc', cors(), npcsController.getOneNPC);
        router.post('/add', cors(), npcsController.saveNPC);
        router.post('/delete', cors(), npcsController.deleteNPCs);
        router.post('/publish', cors(), npcsController.publishNPC);
        router.post('/update', cors(), npcsController.updateNPC);
        

        // router.options('*', cors());

        server.use('/npcs', router)
    }
}

export default NpcsRouter;
