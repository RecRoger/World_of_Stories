import { Router } from 'express';
import { getAllUsers, getUserById, getOneUser, saveUser, updateUser, deleteUser, setUserRol, removeUserRol } from '../controllers/users.controller.js';

const UsersRouter = Router();

UsersRouter.route('/')
  .get(getAllUsers)
  .post(saveUser);        // 201 Created

UsersRouter.post('/login', getOneUser); // Cambiado a POST por seguridad de credenciales

UsersRouter.route('/:id')
  .get(getUserById)
  .put(updateUser)    // PUT con ID por parámetro
  .delete(deleteUser); // DELETE con ID por parámetro

UsersRouter.route('/:id/roles')
  .patch(setUserRol)    // PATCH para modificaciones parciales (añadir)
  .delete(removeUserRol); // DELETE semántico para quitar el recurso del rol

export { UsersRouter };