import { Router } from 'express';
import { getAllUsers, getUserById, getOneUser, saveUser, updateUser, deleteUser, setUserRol, removeUserRol } from '../controllers/users.controller.js';

const usersRouter = Router();

usersRouter.get('/', getAllUsers);
usersRouter.get('/:id', getUserById);
usersRouter.post('/login', getOneUser); // Cambiado a POST por seguridad de credenciales
usersRouter.post('/', saveUser);        // 201 Created
usersRouter.put('/:id', updateUser);    // PUT con ID por parámetro
usersRouter.delete('/:id', deleteUser); // DELETE con ID por parámetro
usersRouter.patch('/:id/roles', setUserRol);    // PATCH para modificaciones parciales (añadir)
usersRouter.delete('/:id/roles', removeUserRol); // DELETE semántico para quitar el recurso del rol

export { usersRouter as userRouter };