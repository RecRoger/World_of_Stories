import { Request, Response } from 'express';
import UsersSchema, { UserInterface } from '../schemas/users.model';

class UsersController {

    // Get All Users
    public async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('*************** getAllUsers *******************');

            const users: UserInterface[] = await UsersSchema.find({}, { _v: 0 }).lean();
            // console.log('Users ======>', users);
            // users.map(user => ({ ...user, id: user._id }))
            console.log('_____________________________________________________');
            res.json({
                "data": { "users": users.map(user => ({ ...user, id: user._id })) }
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
            console.log('.');
            console.log('________________________________________________');
            console.log('*************** getUserByID *******************');
            console.log('> UserId: ' + req.body.id);

            const user: UserInterface | null = await UsersSchema.findById(
                { _id: req.body.id },
                {
                    _v: 0
                }
            ).lean();
            // console.log('User ======>', user);
            console.log('> Response: ' + ((user) ? (user as UserInterface).username : 'not Found'));
            console.log('_____________________________________________________');
            res.json({
                "data": { "user": (user) ? { ...user, id: user._id } : null }
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

            console.log('.');
            console.log('________________________________________________');
            console.log('**************** getOneUser *******************', req.body);

            const { username, password } = req.body;
            const user: UserInterface | null = await UsersSchema.findOne(
                {
                    username: username,
                    password: password
                }, {
                _v: 0
            }
            ).lean();
            // console.log('User ======>', user);
            console.log('> user response: ' + ((user) ? (user as UserInterface).username : 'not Found'));
            console.log('_____________________________________________________');
            res.json({
                "data": { "user": user && { ...user, id: user._id } }
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
        console.log('.');
        console.log('________________________________________________');
        console.log('****************** savwUser *******************');
        try {
            const { username, password } = req.body.user;
            const newUser: UserInterface = new UsersSchema({
                username,
                password,
                rol: []
            });
            await newUser.save();

            const user = await UsersSchema.findOne({ "_id": newUser._id }).lean();

            console.log('> user response:' + ((user) ? (user as UserInterface).username : 'not Found'));
            console.log('_____________________________________________________');
            res.json({
                "data": { "user": { ...user, id: user._id } }
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
            console.log('.');
            console.log('________________________________________________');
            console.log('**************** deleteUser *******************');
            console.log('> userId: ' + req.body.id);
            const user = await UsersSchema.deleteOne({
                _id: req.body.id
            });
            // console.log('Edition ======>', user);
            console.log('> response: ' + ((user.ok) ? 'OK' : 'not Found') + ' ======================');
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
            console.log('.');
            console.log('________________________________________________');
            console.log('************** updateUserRol ******************');

            const { id, rol } = req.body;
            console.log('> userID ' + id);
            console.log('> rol: ' + rol);

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
            ).lean();

            console.log('> response:' + ((edition.ok) ? 'OK' : 'not Found'));
            console.log('_____________________________________________________');
            res.json({
                "data": edition.ok ? { user: user && { ...user, id: user._id } } : null

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
        console.log('.');
        console.log('________________________________________________');
        console.log('*************** removeUserRol *****************');
        try {
            const { id, rol } = req.body;

            console.log('> userId: ' + id);
            console.log('> rol: ' + rol);

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
            ).lean();
            console.log('> response: ' + ((edition.ok) ? 'OK' : 'not Found'));
            console.log('_____________________________________________________');
            res.json({
                "data": edition.ok ? { user: user && { ...user, id: user._id } } : null
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