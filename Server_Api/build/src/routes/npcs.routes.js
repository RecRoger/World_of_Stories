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
const npcs_controller_1 = require("./../controllers/npcs.controller");
const cors_1 = __importDefault(require("cors"));
class NpcsRouter {
    constructor(server) {
        const router = express.Router();
        router.post('/', cors_1.default(), npcs_controller_1.npcsController.getAllNPCs);
        router.post('/npc', cors_1.default(), npcs_controller_1.npcsController.getOneNPC);
        router.post('/new', cors_1.default(), npcs_controller_1.npcsController.saveNPC);
        router.post('/delete', cors_1.default(), npcs_controller_1.npcsController.deleteNPCs);
        router.post('/publish', cors_1.default(), npcs_controller_1.npcsController.publishNPC);
        router.post('/update', cors_1.default(), npcs_controller_1.npcsController.updateNPC);
        // router.options('*', cors());
        server.use('/npcs', router);
    }
}
exports.default = NpcsRouter;
