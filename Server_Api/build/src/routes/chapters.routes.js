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
const chapters_controller_1 = require("./../controllers/chapters.controller");
const cors_1 = __importDefault(require("cors"));
class ChaptersRouter {
    constructor(server) {
        const router = express.Router();
        router.post('/', cors_1.default(), chapters_controller_1.chaptersController.getAllChapters);
        router.post('/chapter', cors_1.default(), chapters_controller_1.chaptersController.getChapter);
        router.post('/update', cors_1.default(), chapters_controller_1.chaptersController.updateChapter);
        router.post('/delete', cors_1.default(), chapters_controller_1.chaptersController.deleteChapter);
        router.post('/publish', cors_1.default(), chapters_controller_1.chaptersController.publishChapter);
        // router.post('/npc', cors(), chaptersController.getOneNPC);
        // router.post('/add', cors(), chaptersController.saveNPC);
        // router.options('*', cors());
        server.use('/chapters', router);
    }
}
exports.default = ChaptersRouter;
