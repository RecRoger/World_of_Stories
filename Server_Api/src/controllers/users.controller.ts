import { Request, Response } from 'express';
import { logError } from './common-logs.js';
import bcrypt from 'bcrypt';
import Users, { UserInterface } from '../schemas/users.model.js';


// Get All Users
export const getAllUsers = async (req: Request, res: Response): Promise<Response> => {
    console.log(`[GET] - getAllUsers - ${new Date().toISOString()}`);
    try {
        const users = await Users.find({}, { _v: 0 }).lean<UserInterface[]>();
        return res.status(200).json({
            ok: true,
            count: users.length,
            data: {
                users: users.map(({ _id, password, ...rest }) => ({
                    id: _id,
                    ...rest // Usamos destructuring para no exponer la contraseña en la API por seguridad
                }))
            }
        });
    } catch (err) {
        console.error('[Error] - getAllUsers', err);
        return logError(res, err, 'Error interno del servidor al recuperar los usuarios',)
    }
}

// Get User by ID
export const getUserById = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params; // Capturamos desde la URL: /users/:id
    console.log(`[POST] - getUserById para el ID: ${id} - ${new Date().toISOString()}`);
    try {
        const user = await Users.findById(id, { _v: 0 })
            .select('-password')
            .lean<UserInterface | null>();

        if (!user) {
            console.log(`[POST] - getUserById ${id} NotFound - ${new Date().toISOString()}`);
            return res.status(404).json({
                ok: false,
                message: `No se encontró ningún usuario con el ID: ${id}`
            });
        }

        return res.status(200).json({
            ok: true,
            data: {
                user: {
                    id: user?._id,
                    ...user
                }
            }
        });
    } catch (err) {
        console.error('[Error] - getUserById', err);
        return logError(res, err, 'Error interno del servidor al recuperar el usuario')
    }
}

// Get User username and password
export const getOneUser = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { username, password } = req.body;
        console.log(`[POST] - getOneUser - para: ${username} - ${new Date().toISOString()}`);

        const user = await Users.findOne({ $or: [{ username: username }, { email: username }] }, { _v: 0 })
            .lean<UserInterface>();

        if (!user) {
            console.log(`[POST] - getOneUser - ${username} NotFound`);
            return res.status(404).json({
                ok: false,
                message: `No se encontró ningún usuario o correo "${username}"`
            });
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            console.log(`[POST] - getOneUser - invalid password`);
            return res.status(401).json({ // 401 Unauthorized para credenciales inválidas
                ok: false,
                message: 'La contraseña ingresada es incorrecta'
            });
        }

        const { password: _, ...userWithoutPassword } = user;
        return res.status(200).json({
            ok: true,
            data: {
                user: {
                    id: user._id,
                    ...userWithoutPassword
                }
            }
        });
    } catch (err) {
        console.error('[Error] - getOneUser', err);
        return logError(res, err, 'Error interno del servidor al recuperar el usuario')
    }
}

// Save new User
export const saveUser = async (req: Request, res: Response): Promise<Response> => {
    const { email, username, password } = req.body.user;
    console.log(`[POST] - saveUser para: ${username} - ${new Date().toISOString()}`);
    try {
        const exist = await Users.findOne({ $or: [{ username }, { email }] }, { _v: 0 })
            .lean<UserInterface | null>();
        if (exist) {
            console.log(`[POST] - saveUser - ${username === exist.username ? 'username' : 'email'} duplicado - ${new Date().toISOString()}`);
            return res.status(409).json({ // 409 Conflict es ideal para campos únicos duplicados
                ok: false,
                message: `${username === exist.username ? 'El username' : 'El email'} ya está registrado`
            });
        }

        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = new Users({
            email,
            username,
            password: hashedPassword,
            rol: []
        });
        await newUser.save();
        const userObject = newUser.toJSON();
        const { password: _, __v, ...cleanUser } = userObject;

        return res.status(200).json({
            ok: true,
            data: { user: cleanUser ? { id: cleanUser?._id, ...cleanUser } : null }
        });
    } catch (err) {
        console.error('[Error] - saveUser', err);
        return logError(res, err, 'Error interno del servidor al guardar el usuario')
    }
}

// Update
export const updateUser = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { email, username, password } = req.body.user;
    console.log(`[POST] - updateUser para: ${username || email || id} - ${new Date().toISOString()}`);
    try {
        const exist = await Users.findOne({
            _id: { $ne: id },
            $or: [{ username: username }, { email: email }],
        }).lean<UserInterface | null>();

        if (exist) {
            console.log(`[POST] - updateUser - ${username === exist.username ? 'username' : 'email'} duplicado - ${new Date().toISOString()}`);
            return res.status(409).json({
                ok: false,
                message: `${username === exist.username ? 'El username' : 'El email'} ya está siendo usado`
            });
        }
        const updateData: Record<string, any> = { email, username };
        if (password && password.trim() !== '') {
            const saltRounds = 10;
            updateData.password = await bcrypt.hash(password, saltRounds);
            console.log('-> Contraseña modificada y encriptada con éxito.');
        }
        const updatedUser = await Users.findByIdAndUpdate(
            id,
            { $set: updateData },
            { new: true, runValidators: true }
        )
            .select('-password')
            .lean();
        if (!updatedUser) {
            console.log(`[POST] - updateUser - el id ${id} no existe - ${new Date().toISOString()}`);
            return res.status(404).json({
                ok: false,
                message: 'No se encontró el usuario que se intentó actualizar.'
            });
        }
        return res.status(200).json({
            "ok": true,
            "data": { user: { id: updatedUser._id, ...updatedUser } }
        })
    } catch (err) {
        console.error('[Error] - updateUser', err);
        return logError(res, err, 'Error interno del servidor al actualizar el usuario')
    }
}

// delete User
export const deleteUser = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    console.log(`[DELETE] - deleteUser para el ID: ${id} - ${new Date().toISOString()}`);
    try {
        const deletedUser = await Users.findByIdAndDelete(id).lean();

        if (!deletedUser) {
            console.log(`[DELETE] - deleteUser - Usuario not found - ${new Date().toISOString()}`);
            return res.status(404).json({
                ok: false,
                message: `No se pudo eliminar: No se encontró ningún usuario con el ID "${id}".`
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Usuario eliminado correctamente de la base de datos.',
            data: {
                user: {
                    id: deletedUser._id,
                    username: deletedUser.username,
                    email: deletedUser.email
                }
            }
        });

    } catch (err) {
        console.error('[Error] - deleteUser:', err);
        return logError(res, err, 'Error interno del servidor al intentar eliminar el usuario');
    }
};



export const setUserRol = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params; // ID por parámetro de ruta: /users/:id/roles
    const { rol } = req.body;  // El rol a añadir viene en el body

    console.log(`[PATCH] - setUserRol para ID: ${id}, Rol: ${rol} - ${new Date().toISOString()}`);

    try {
        const updatedUser = await Users.findByIdAndUpdate(
            id,
            { $addToSet: { rol: rol } },
            { new: true, runValidators: true }
        )
            .select('-password')
            .lean();
        if (!updatedUser) {
            console.log(`[PATCH] - setUserRol - User Not Found`);
            return res.status(404).json({
                ok: false,
                message: 'No se encontró el usuario para asignarle el rol.'
            });
        }
        return res.status(200).json({
            ok: true,
            message: `Rol '${rol}' añadido correctamente.`,
            data: {
                user: {
                    id: updatedUser._id,
                    ...updatedUser
                }
            }
        });

    } catch (err) {
        console.error('[Error] - setUserRol:', err);
        return logError(res, err, 'Error interno del servidor al añadir el rol');
    }
};

export const removeUserRol = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { rol } = req.body;

    console.log(`[DELETE] - removeUserRol para ID: ${id}, Rol: ${rol} - ${new Date().toISOString()}`);

    try {
        const updatedUser = await Users.findByIdAndUpdate(
            id,
            { $pull: { rol: rol } },
            { new: true }
        )
            .select('-password')
            .lean();

        if (!updatedUser) {
            console.log(`[PATCH] - removeUserRol - Not Found`);
            return res.status(404).json({
                ok: false,
                message: 'No se encontró el usuario para removerle el rol.'
            });
        }

        return res.status(200).json({
            ok: true,
            message: `Rol '${rol}' removido correctamente.`,
            data: {
                user: {
                    id: updatedUser._id,
                    ...updatedUser
                }
            }
        });

    } catch (err) {
        console.error('[Error] - removeUserRol:', err);
        return logError(res, err, 'Error interno del servidor al remover el rol');
    }
};