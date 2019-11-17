import { Request, Response, Router } from 'express';
import { usersController } from './../controllers/users.controller'

const userRouter: Router = Router();

userRouter.get('/users', usersController.getAllUsers);

userRouter.post('/user_by_id', usersController.getUserById);

userRouter.post('/user', usersController.getOneUser);

userRouter.post('/add', usersController.saveUser);

userRouter.post('/delete', usersController.deleteUser);

userRouter.post('/update_rol', usersController.updateUserRol);

userRouter.post('/remove_rol', usersController.removeUserRol);

export default userRouter;