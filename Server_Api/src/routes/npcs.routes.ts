import * as express from 'express'
import { npcsController } from './../controllers/npcs.controller'
// import cors from 'cors'

class npcsRouter {
    constructor(server: express.Express){
        const router = express.Router();

        router.post('/npcs', npcsController.getAllNPCs);
        router.post('/npc', npcsController.getOneNPC);
        router.post('/add', npcsController.saveNPC);
        router.post('/delete', npcsController.deleteNPCs);
        router.post('/publish', npcsController.publishNPC);
        router.post('/update', npcsController.updateNPC);
        

        // router.options('*', cors());

        server.use('/npcs', router)
    }
}

export default npcsRouter;
