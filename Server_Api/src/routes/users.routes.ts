import * as express from 'express'
import { usersController } from './../controllers/users.controller'
import cors from 'cors'

class UserRouter {
    constructor(server: express.Application){
        const router = express.Router();

        router.get('/', cors(), usersController.getAllUsers);

        router.post('/login', cors(), usersController.getOneUser);
        
        router.post('/user', cors(), usersController.getUserById);
        
        router.post('/signin', cors(), usersController.saveUser);

        router.post('/update', cors(), usersController.updateUser);
        
        router.post('/delete', cors(), usersController.deleteUser);
        
        router.post('/set_rol', cors(), usersController.setUserRol);
        
        router.post('/remove_rol', cors(), usersController.removeUserRol);

        // router.options('*', cors());

        server.use('/users', router)
    }
}

export default UserRouter;