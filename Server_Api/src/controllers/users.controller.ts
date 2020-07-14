import { Request, Response } from 'express';
import UsersSchema, { UserInterface } from '../schemas/users.model';

class UsersController {

    // Get All Users
    public async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            console.log('*************** getAllUsers *******************');

            const users: UserInterface[] = await UsersSchema.find({}, { _v: 0 });
            // console.log('Users ======>', users);
            console.log('_____________________________________________________');
            res.json({
                "data": { "users": users }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })

        }
    }
    // Get User by ID
    public async getUserById(req: Request, res: Response): Promise<void> {
        try {
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            console.log('*************** getUserByID *******************');
            console.log('*************** ' + req.body.id + ' *******************');

            const user: UserInterface | null = await UsersSchema.findById(
                { _id: req.body.id },
                {
                    _v: 0
                }
            );
            // console.log('User ======>', user);
            console.log('===================== ' + ((user) ? (user as UserInterface).username : 'not Found') + ' ======================');
            console.log('_____________________________________________________');
            res.json({
                "data": { "user": user }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }
    // Get User username and password
    public async getOneUser(req: Request, res: Response): Promise<void> {
        try {

            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            console.log('**************** getOneUser *******************', req.body);

            const { username, password } = req.body;
            const user: UserInterface | null = await UsersSchema.findOne(
                {
                    username: username,
                    password: password
                }, {
                _v: 0
            }
            );
            // console.log('User ======>', user);
            console.log('===================== ' + ((user) ? (user as UserInterface).username : 'not Found') + ' ======================');
            console.log('_____________________________________________________');
            res.json({
                "data": { "user": user }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }
    // Save new User
    public async saveUser(req: Request, res: Response): Promise<void> {
        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
        console.log('****************** savwUser *******************', req.body);
        try {
            const { username, password } = req.body.user;
            const user: UserInterface = new UsersSchema({
                username,
                password,
                rol: []
            });
            await user.save();
            console.log('===================== ' + ((user) ? (user as UserInterface).username : 'not Found') + ' ======================');
            console.log('_____________________________________________________');
            res.json({
                "data": { "user": user }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }
    // delete User
    public async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            console.log('**************** deleteUser *******************');
            console.log('**************** ' + req.body.id + ' *******************');
            const user = await UsersSchema.deleteOne({
                _id: req.body.id
            });
            // console.log('Edition ======>', user);
            console.log('===================== ' + ((user.ok) ? 'OK' : 'not Found') + ' ======================');
            console.log('_____________________________________________________');
            res.json({
                "data": user.ok ? 'OK' : 'error'
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }

    public async setUserRol(req: Request, res: Response): Promise<void> {
        try {
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            console.log('************** updateUserRol ******************');

            const { id, rol } = req.body;
            console.log('************** ' + id + ' ******************');
            console.log('************** Rol: ' + rol + ' ******************');

            const edition = await UsersSchema.updateOne(
                { _id: id },
                {
                    $push: {
                        rol: [rol]
                    }
                }
            );
            const user: UserInterface | null = await UsersSchema.findById(
                { _id: id },
                { _v: 0 }
            );

            console.log('===================== ' + ((edition.ok) ? 'OK' : 'not Found') + ' ======================');
            console.log('_____________________________________________________');
            res.json({
                "data": edition.ok ? user : null
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }
    public async removeUserRol(req: Request, res: Response): Promise<void> {
        console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
        console.log('*************** removeUserRol *****************');
        try {
            const { id, rol } = req.body;

            console.log('************** ' + id + ' ******************');
            console.log('************** Rol: ' + rol + ' ******************');

            const edition = await UsersSchema.updateOne(
                { _id: id },
                {
                    $pull: {
                        rol: { $in: [rol] }
                    }
                }
            );
            const user: UserInterface | null = await UsersSchema.findById(
                { _id: id },
                { _v: 0 }
            );
            console.log('===================== ' + ((edition.ok) ? 'OK' : 'not Found') + ' ======================');
            console.log('_____________________________________________________');
            res.json({
                "data": edition.ok ? user : null
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }
}


export const usersController = new UsersController();