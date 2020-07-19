import { Request, Response } from 'express';
import NpcsSchema, { NpcInterface } from '../schemas/npcs.model';
import CitiesSchema from '../schemas/cities.model';
import { chaptersController } from './chapters.controller';

class NpcsController {

    // get all npcs of a places
    public async getAllNPCs(req: Request, res: Response) {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('*************** getAllNPCs *******************');

            const { ids, published } = req.body;
            console.log('> ids: ', ids);

            const npcs: NpcInterface[] = await NpcsSchema.find(
                {
                    _id: { $in: ids },
                },
                {
                    // decision: 0,
                    // rejected: 0,
                    //items:0,
                    title: 0,
                    chapters: 0,
                }
            ).lean();
            let filterNpcs = npcs
            console.log('_____________________________________________________');
            if (published) {
                filterNpcs = npcs.filter(npc => npc.published == true);
            }
            res.json({
                "data": { "npcs": filterNpcs.map(npc => ({ ...npc, id: npc._id })) }
            })
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }
    // get get complete NPC y ID
    public async getOneNPC(req: Request, res: Response) {
        try {

            console.log('.');
            console.log('________________________________________________');
            console.log('*************** getOneNPC **************************');
            console.log('> npcId: ' + req.body.id);

            const { id, published } = req.body;

            const filters = (published) ? { _id: id, published: true } : { _id: id };
            const npc: NpcInterface | null = await NpcsSchema.findById(
                filters,
                {
                    "chapters": 0
                    // "chapters.description": 0,
                    // "chapters.story": 0,
                    // "chapters.usersDecisions": 0,
                    // "chapters.itemsDecisions": 0,
                    // considerar
                    // tipo de "chapters.batalla": 0,
                    // "chapters.enemigo": 0,
                    // "chapters.defeat": 0,
                    // "chapters.item": 0,
                }
            ).lean();

            const castNpc = npc ? {
                ...npc,
                id: npc._id,
                description: npc.description ? {
                    ...npc.description,
                    id: npc.description._id
                } : {},
                meeting: npc.meeting ? {
                    ...npc.meeting,
                    id: npc.meeting._id
                } : {}

            } : null;

            console.log('> response:' + ((npc) ? (<NpcInterface>npc).name : npc));
            console.log('_____________________________________________________');

            res.json({
                "data": { "npc": castNpc }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }


    // save new NPC
    public async saveNPC(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('*************** saveNPC **************************');

            const { placeId, npc } = req.body;
            console.log('> placeId: ', placeId)

            const newNpc: NpcInterface = new NpcsSchema({

                name: npc.name,		       // nombre aislado del personaje
                npcType: npc.npcType, 		   // lugar de 'historias', 'tienda', 'posta de caballos' etc.
                description: {
                    tale: npc.description,
                    author: npc.author,
                    published: false
                },
                meeting: {
                    tale: npc.meeting,
                    author: npc.author,
                    published: false
                },
                decision: {
                    decisionType: npc.decision.decisionType,
                    amount: npc.decision.amount,
                    item: npc.decision.item,
                    options: [{
                        name: npc.decision.options[0].name,
                        description: npc.decision.options[0].description,
                        value: npc.decision.options[0].value,
                        published: npc.decision.options[0].published,
                        removeItem: npc.decision.options[0].removeItem
                    }, {
                        name: npc.decision.options[1].name,
                        description: npc.decision.options[1].description,
                        value: npc.decision.options[1].value,
                        published: npc.decision.options[1].published,
                        removeItem: npc.decision.options[1].removeItem
                    }]

                },
                rejected: {
                    tale: npc.rejected,
                    author: npc.author,
                    published: false
                },
                items: [],	       // items del npc (tienda);
                title: npc.title,		       // Titulo de la historia
                chapters: [{
                    name: '',
                    story: [],	                // narracion previa a batalla o decision.
                    published: false,
                    writeDate: new Date()     // Fecha de creacion
                }],
                author: npc.author,
                published: false,
                writeDate: new Date()     // Fecha de creacion
            });
            await newNpc.save();
            console.log('> newNpcId: ', newNpc._id);
            const placeEdition = await CitiesSchema.updateOne(
                { "places._id": placeId },
                {
                    $push: {
                        "places.$.events": [newNpc._id]
                    }
                }
            ).lean();
            console.log('> placeEdition: ', placeEdition);

            const npcSearch: NpcInterface | null = await NpcsSchema.findOne({ _id: newNpc._id }).lean();
            const castNpc = npcSearch ? {
                ...npcSearch,
                id: npcSearch._id,
                description: npcSearch.description ? {
                    ...npcSearch.description,
                    id: npcSearch.description._id
                } : {},
                meeting: npcSearch.meeting ? {
                    ...npcSearch.meeting,
                    id: npcSearch.meeting._id
                } : {},
                chapters: npcSearch && npcSearch.chapters ? [{ ...npcSearch.chapters[0], id: npcSearch.chapters[0]._id }] : []

            } : null;

            console.log('> response:' + ((castNpc) ? (castNpc).name : npc));
            console.log('_____________________________________________________');

            res.json({
                "data": { "npc": castNpc }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }

    }

    // delete NPCs
    public async deleteNPCs(req: Request, res: Response): Promise<void> {
        try {

            console.log('.');
            console.log('________________________________________________');
            console.log('**************** deleteNPCs *******************');
            const { npcId, placeId } = req.body;
            console.log('> placeId: ', placeId);
            console.log('> npcId: ', npcId);


            const edition = await NpcsSchema.deleteOne({
                _id: npcId
            });

            const city = await CitiesSchema.updateOne(
                { "places._id": placeId },
                {
                    $pull: {
                        "places.$.events": npcId
                    }
                }
            );
            console.log('> response: ' + ((edition.ok) ? 'OK' : 'not Found'));
            console.log('_____________________________________________________');
            res.json({
                "data": (edition.ok) ? 'OK' : 'error'
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }

    // publicar NPC
    public async publishNPC(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('**************** publishNPC *******************');

            const { id, published } = req.body;
            console.log('> npcId: ' + id);
            console.log('> Publish Status: ' + published);

            const edition = await NpcsSchema.updateOne(
                { _id: id },
                {
                    published: published,
                    publishDate: (published) ? new Date() : null
                }
            );
            console.log('> repsonse:' + ((edition.nModified) ? 'OK' : 'not Found'));
            console.log('_____________________________________________________');
            res.json({
                "data": (edition.nModified) ? 'OK' : 'error'
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }
    // updates NPC
    public async updateNPC(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('**************** updateNPC *******************');
            const { id, npc } = req.body;
            console.log('> npcId: ' + id);

            let updates: any = {};
            if (npc.name) updates.name = npc.name;
            if (npc.description) {
                updates['description.tale'] = npc.description;
                updates['description.author'] = npc.author;
            }
            if (npc.meeting) {
                updates['meeting.tale'] = npc.meeting;
                updates['meeting.author'] = npc.author;
            }
            if (npc.decision) {
                updates['decision.decisionType'] = npc.decision.decisionType;
                updates['decision.amount'] = npc.decision.amount;
                updates['decision.item'] = npc.decision.item;
                updates['decision.options'] = [{
                    name: npc.decision.options[0].name,
                    description: npc.decision.options[0].description,
                    value: npc.decision.options[0].value,
                    published: npc.decision.options[0].published,
                    removeItem: npc.decision.options[0].removeItem
                }, {
                    name: npc.decision.options[1].name,
                    description: npc.decision.options[1].description,
                    value: npc.decision.options[1].value,
                    published: npc.decision.options[1].published,
                    removeItem: npc.decision.options[1].removeItem
                }];
            };
            if (npc.items) updates.items = npc.items;
            if (npc.rejected) {
                updates['rejected.tale'] = npc.rejected;
                updates['rejected.author'] = npc.author;
            }
            if (npc.title) updates.title = npc.title;
            updates.writeDate = new Date();

            const edition = await NpcsSchema.updateOne(
                { _id: id },
                {
                    $set: updates
                }
            ).lean();
            console.log('> npc edition: ', edition);

            const editedNpc: NpcInterface | null = await NpcsSchema.findById(
                { _id: id },
                {
                    "chapters": 0
                }
            ).lean();

            const castNpc = editedNpc ? {
                ...editedNpc,
                id: editedNpc._id,
                description: editedNpc.description ? {
                    ...editedNpc.description,
                    id: editedNpc.description._id
                } : {},
                meeting: editedNpc.meeting ? {
                    ...editedNpc.meeting,
                    id: editedNpc.meeting._id
                } : {}

            } : null;

            console.log('> response:' + ((editedNpc) ? (<NpcInterface>editedNpc).name : editedNpc));
            console.log('_____________________________________________________');

            res.json({
                "data": { "npc": castNpc }
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


export const npcsController = new NpcsController();
