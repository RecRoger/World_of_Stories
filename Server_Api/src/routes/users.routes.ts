import * as express from 'express'
import { usersController } from './../controllers/users.controller'
// import cors from 'cors'

class UserRouter {
    constructor(server: express.Express){
        const router = express.Router();

        router.get('/', usersController.getAllUsers);

        router.post('/login', usersController.getOneUser);

        router.post('/user', usersController.getOneUser);
        
        router.post('/user_by_id', usersController.getUserById);
        
        router.post('/signin', usersController.saveUser);
        
        router.post('/delete', usersController.deleteUser);
        
        router.post('/update_rol', usersController.updateUserRol);
        
        router.post('/remove_rol', usersController.removeUserRol);

        // router.options('*', cors());

        server.use('/users', router)
    }
}

export default UserRouter;