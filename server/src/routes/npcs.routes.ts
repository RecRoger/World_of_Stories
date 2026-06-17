import { Router } from 'express'
import { deleteNPCs, getAllNPCs, getOneNPC, publishNPC, saveNPC, updateNPC } from '../controllers/npcs.controller.js';

const NpcsRouter = Router();

NpcsRouter.route('/place/:placeId')
    .get(getAllNPCs)
    .post(saveNPC);

NpcsRouter.route('/:npcId')
    .delete(deleteNPCs)
    .get(getOneNPC)
    .put(updateNPC);

NpcsRouter.patch('/:npcId/publish', publishNPC);

export { NpcsRouter };
