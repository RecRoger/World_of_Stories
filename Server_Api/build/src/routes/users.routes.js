"use strict";
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = __importStar(require("express"));
const users_controller_1 = require("./../controllers/users.controller");
const cors_1 = __importDefault(require("cors"));
class UserRouter {
    constructor(server) {
        const router = express.Router();
        router.get('/', cors_1.default(), users_controller_1.usersController.getAllUsers);
        router.post('/login', cors_1.default(), users_controller_1.usersController.getOneUser);
        router.post('/user', cors_1.default(), users_controller_1.usersController.getUserById);
        router.post('/signin', cors_1.default(), users_controller_1.usersController.saveUser);
        router.post('/delete', cors_1.default(), users_controller_1.usersController.deleteUser);
        router.post('/set_rol', cors_1.default(), users_controller_1.usersController.setUserRol);
        router.post('/remove_rol', cors_1.default(), users_controller_1.usersController.removeUserRol);
        // router.options('*', cors());
        server.use('/users', router);
    }
}
exports.default = UserRouter;
