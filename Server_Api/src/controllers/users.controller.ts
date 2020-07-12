import { Request, Response } from 'express';
import UsersSchema, { UserInterface } from '../models/users.model';

class UsersController {

    // Get All Users
    public async getAllUsers(req: Request, res: Response): Promise<void> {
        try {
            console.log('***********************************************');
            console.log('*************** getAllUsers *******************');

            const users: UserInterface[] = await UsersSchema.find({}, { _v: 0});
            console.log('Users ======>', users);
            console.log('===============================================');
            res.json({
                "data": { "users": users }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('===============================================');
            res.json({
                "error": err
            })

        }
    }
    // Get User by ID
    public async getUserById(req: Request, res: Response): Promise<void> {
        try {
            console.log('***********************************************');
            console.log('*************** getUserByID *******************', req.body);

            const user: UserInterface | null = await UsersSchema.findById(
                { _id: req.body.id },
                {
                    _v: 0
                }
            );
            console.log('User ======>', user);
            console.log('===============================================');
            res.json({
                "data": { "user": user }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('===============================================');
            res.json({
                "error": err
            })
        }
    }
    // Get User username and password
    public async getOneUser(req: Request, res: Response): Promise<void> {
        try {

            console.log('***********************************************');
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
            console.log('User ======>', user);
            console.log('===============================================');
            res.json({
                "data": { "user": user }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('===============================================');
            res.json({
                "error": err
            })
        }
    }
    // Save new User
    public async saveUser(req: Request, res: Response): Promise<void> {
        console.log('***********************************************');
        console.log('****************** savwUser *******************', req.body);
        try {
            const { username, password } = req.body;
            const user: UserInterface = new UsersSchema({
                username,
                password,
                rol: []
            });
            await user.save();
            console.log('User ======>', user);
            console.log('===============================================');
            res.json({
                "data": { "user": user }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('===============================================');
            res.json({
                "error": err
            })
        }
    }
    // delete User
    public async deleteUser(req: Request, res: Response): Promise<void> {
        try {
            console.log('***********************************************');
            console.log('**************** deleteUser *******************', req.body);
            const user = await UsersSchema.deleteOne({
                _id: req.body.id
            });
            console.log('Edition ======>', user);
            console.log('===============================================');
            res.json({
                "data": user
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('===============================================');
            res.json({
                "error": err
            })
        }
    }

    public async updateUserRol(req: Request, res: Response): Promise<void> {
        try {
            console.log('***********************************************');
            console.log('************** updateUserRol ******************', req.body);
            const { id, rol } = req.body;
            const user = await UsersSchema.updateOne(
                { _id: id },
                {
                    $push: {
                        rol: [rol]
                    }
                }
            );
            console.log('Edition ======>', user);
            console.log('===============================================');
            res.json({
                "data": user
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('===============================================');
            res.json({
                "error": err
            })
        }
    }
    public async removeUserRol(req: Request, res: Response): Promise<void> {
        console.log('***********************************************');
        console.log('*************** removeUserRol *****************', req.body);
        try {
            const { id, rol } = req.body;
            const user = await UsersSchema.updateOne(
                { _id: id },
                {
                    $pull: {
                        rol: { $in: [rol] }
                    }
                }
            );
            console.log('Edition ======>', user);
            console.log('===============================================');
            res.json({
                "data": user
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('===============================================');
            res.json({
                "error": err
            })
        }
    }
}


export const usersController = new UsersController();