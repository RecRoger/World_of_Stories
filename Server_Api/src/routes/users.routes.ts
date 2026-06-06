import { Router } from 'express';
import {
    getAllUsers,
    getUserById,
    getOneUser,
    saveUser,
    updateUser,
    deleteUser,
    setUserRol,
    removeUserRol
} from '../controllers/users.controller.js';

const userRouter = Router();

userRouter.get('/', getAllUsers);
userRouter.get('/:id', getUserById);
userRouter.post('/login', getOneUser); // Cambiado a POST por seguridad de credenciales
userRouter.post('/', saveUser);        // 201 Created
userRouter.put('/:id', updateUser);    // PUT con ID por parámetro
userRouter.delete('/:id', deleteUser); // DELETE con ID por parámetro
userRouter.patch('/:id/roles', setUserRol);    // PATCH para modificaciones parciales (añadir)
userRouter.delete('/:id/roles', removeUserRol); // DELETE semántico para quitar el recurso del rol
export { userRouter };