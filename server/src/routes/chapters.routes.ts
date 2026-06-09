// src/routes/chapters.routes.ts
import { Router } from 'express';
import {
    getAllChapters,
    getChapter,
    updateChapter,
    deleteChapter,
    publishChapter
} from '../controllers/chapters.controller.js';

const ChaptersRouter = Router();

ChaptersRouter.get('/npc/:npcId', getAllChapters);

ChaptersRouter.route('/:id')
    .get(getChapter)
    .put(updateChapter)
    .delete(deleteChapter);

ChaptersRouter.patch('/:id/publish', publishChapter);

export { ChaptersRouter };