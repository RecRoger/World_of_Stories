"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const users_model_1 = __importDefault(require("../schemas/users.model"));
class UsersController {
    // Get All Users
    getAllUsers(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('*************** getAllUsers *******************');
                const users = yield users_model_1.default.find({}, { _v: 0 }).lean();
                // console.log('Users ======>', users);
                // users.map(user => ({ ...user, id: user._id }))
                console.log('_____________________________________________________');
                res.json({
                    "data": { "users": users.map(user => (Object.assign({}, user, { id: user._id }))) }
                });
            }
            catch (err) {
                console.log('Error ---->', err);
                console.log('_____________________________________________________');
                res.json({
                    "error": err
                });
            }
        });
    }
    // Get User by ID
    getUserById(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('*************** getUserByID *******************');
                console.log('> UserId: ' + req.body.id);
                const user = yield users_model_1.default.findById({ _id: req.body.id }, {
                    _v: 0
                }).lean();
                // console.log('User ======>', user);
                console.log('> Response: ' + ((user) ? user.username : 'not Found'));
                console.log('_____________________________________________________');
                res.json({
                    "data": { "user": (user) ? Object.assign({}, user, { id: user._id }) : null }
                });
            }
            catch (err) {
                console.log('Error ---->', err);
                console.log('_____________________________________________________');
                res.json({
                    "error": err
                });
            }
        });
    }
    // Get User username and password
    getOneUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** getOneUser *******************', req.body);
                const { username, password } = req.body;
                const user = yield users_model_1.default.findOne({
                    $and: [
                        {
                            $or: [
                                { username: username },
                                { email: username },
                            ]
                        },
                        { password: password }
                    ]
                }, {
                    _v: 0
                }).lean();
                console.log('> user response: ' + ((user) ? user.username : 'not Found'));
                console.log('_____________________________________________________');
                // console.log('User ======>', user);
                res.json({
                    "data": { "user": user && Object.assign({}, user, { id: user._id }) }
                });
            }
            catch (err) {
                console.log('Error ---->', err);
                console.log('_____________________________________________________');
                res.json({
                    "error": err
                });
            }
        });
    }
    // Save new User
    saveUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('.');
            console.log('________________________________________________');
            console.log('****************** savwUser *******************');
            try {
                const { email, username, password } = req.body.user;
                const exist = yield users_model_1.default.findOne({
                    $or: [
                        { username: username },
                        { email: email },
                    ]
                }, {
                    _v: 0
                }).lean();
                if (!exist) {
                    const newUser = new users_model_1.default({
                        email,
                        username,
                        password,
                        rol: []
                    });
                    yield newUser.save();
                    const user = yield users_model_1.default.findOne({ "_id": newUser._id }).lean();
                    console.log('> user response:' + ((user) ? user.username : 'not Found'));
                    console.log('_____________________________________________________');
                    res.json({
                        "data": { "user": Object.assign({}, user, { id: user._id }) }
                    });
                }
                else {
                    console.log('> user repeated:' + (exist));
                    console.log('_____________________________________________________');
                    res.json({
                        "data": "repeated"
                    });
                }
            }
            catch (err) {
                console.log('Error ---->', err);
                console.log('_____________________________________________________');
                res.json({
                    "error": err
                });
            }
        });
    }
    // Update
    updateUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('.');
            console.log('________________________________________________');
            console.log('****************** updateUser *******************');
            try {
                const { id, email, username, password } = req.body.user;
                console.log('> userID ' + id);
                const exist = yield users_model_1.default.findOne({
                    $and: [
                        { _id: { $ne: id } },
                        {
                            $or: [
                                { username: username },
                                { email: email },
                            ]
                        }
                    ]
                }, {
                    _v: 0
                }).lean();
                if (!exist) {
                    const edition = yield users_model_1.default.updateOne({ _id: id }, {
                        $set: {
                            email: email,
                            username: username,
                            password: password,
                        }
                    });
                    const user = yield users_model_1.default.findById({ _id: id }, { _v: 0 }).lean();
                    console.log('> response:' + ((edition.ok) ? 'OK' : 'not Found'));
                    console.log('_____________________________________________________');
                    res.json({
                        "data": edition.ok ? { user: user && Object.assign({}, user, { id: user._id }) } : null
                    });
                }
                else {
                    console.log('> user repeated:' + (exist));
                    console.log('_____________________________________________________');
                    res.json({
                        "data": "repeated"
                    });
                }
            }
            catch (err) {
                console.log('Error ---->', err);
                console.log('_____________________________________________________');
                res.json({
                    "error": err
                });
            }
        });
    }
    // delete User
    deleteUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('**************** deleteUser *******************');
                console.log('> userId: ' + req.body.id);
                const user = yield users_model_1.default.deleteOne({
                    _id: req.body.id
                });
                // console.log('Edition ======>', user);
                console.log('> response: ' + ((user.ok) ? 'OK' : 'not Found') + ' ======================');
                console.log('_____________________________________________________');
                res.json({
                    "data": user.ok ? 'OK' : 'error'
                });
            }
            catch (err) {
                console.log('Error ---->', err);
                console.log('_____________________________________________________');
                res.json({
                    "error": err
                });
            }
        });
    }
    setUserRol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                console.log('.');
                console.log('________________________________________________');
                console.log('************** updateUserRol ******************');
                const { id, rol } = req.body;
                console.log('> userID ' + id);
                console.log('> rol: ' + rol);
                const edition = yield users_model_1.default.updateOne({ _id: id }, {
                    $push: {
                        rol: [rol]
                    }
                });
                const user = yield users_model_1.default.findById({ _id: id }, { _v: 0 }).lean();
                console.log('> response:' + ((edition.ok) ? 'OK' : 'not Found'));
                console.log('_____________________________________________________');
                res.json({
                    "data": edition.ok ? { user: user && Object.assign({}, user, { id: user._id }) } : null
                });
            }
            catch (err) {
                console.log('Error ---->', err);
                console.log('_____________________________________________________');
                res.json({
                    "error": err
                });
            }
        });
    }
    removeUserRol(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            console.log('.');
            console.log('________________________________________________');
            console.log('*************** removeUserRol *****************');
            try {
                const { id, rol } = req.body;
                console.log('> userId: ' + id);
                console.log('> rol: ' + rol);
                const edition = yield users_model_1.default.updateOne({ _id: id }, {
                    $pull: {
                        rol: { $in: [rol] }
                    }
                });
                const user = yield users_model_1.default.findById({ _id: id }, { _v: 0 }).lean();
                console.log('> response: ' + ((edition.ok) ? 'OK' : 'not Found'));
                console.log('_____________________________________________________');
                res.json({
                    "data": edition.ok ? { user: user && Object.assign({}, user, { id: user._id }) } : null
                });
            }
            catch (err) {
                console.log('Error ---->', err);
                console.log('_____________________________________________________');
                res.json({
                    "error": err
                });
            }
        });
    }
}
exports.usersController = new UsersController();
