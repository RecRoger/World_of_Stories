import * as express from 'express'
import cors from 'cors'
import { charactersController } from '../controllers/characters.controller';

class CharactersRouter {
    constructor(server: express.Express){
        const router = express.Router();

        router.post('/', cors(), charactersController.getUserCharacters);
        router.post('/new', cors(), charactersController.newCharacter);
        router.post('/read', cors(), charactersController.setCharacterFragmentRead);
        router.post('/update', cors(), charactersController.updateCharacter);
        router.post('/delete', cors(), charactersController.deleteCharacter);
        

        // router.options('*', cors());

        server.use('/characters', router)
    }
}

export default CharactersRouter;
