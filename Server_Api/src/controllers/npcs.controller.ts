import { Request, Response } from 'express';
import NpcsSchema, { NpcInterface } from '../models/npcs.model';
import CitiesSchema from '../models/cities.model';

class NpcsController {

    // get all npcs of a places
    public async getAllNPCs(req: Request, res: Response) {
        const { ids, published } = req.body;
        try {
            const npcs: NpcInterface[] = await NpcsSchema.find(
                {
                    _id: { $in: ids },
                },
                {
                    decision: 0,
                    rejected: 0,
                    //items:0,
                    title: 0,
                    chapters: 0,
                }
            );
            let filterNpcs = npcs
            if(published){
                filterNpcs = npcs.filter(npc=> npc.published == true);
            }
            res.json({
                "data": { "npcs": filterNpcs }
            })
        } catch (err) {
            res.json({
                "error": err
            })
        }
    }
    // get get complete NPC y ID
    public async getOneNPC(req: Request, res: Response) {
        const { id, published } = req.body;
        try {
            const npc: NpcInterface | null = await NpcsSchema.findById(
                {
                    _id: id,
                    published: (published) ? true : null
                },
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
            );
            res.json({
                "data": npc
            });
        } catch (err) {
            res.json({
                "error": err
            })
        }
    }
    // save new NPC
    public async saveNPC(req: Request, res: Response): Promise<void> {
        try {
            const { id, npc } = req.body;

            const newNpc: NpcInterface = new NpcsSchema({

                name: npc.name,		       // nombre aislado del personaje
                npc_type: npc.npc_type, 		   // lugar de 'historias', 'tienda', 'posta de caballos' etc.
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
                decision: npc.decision,
                rejected: {
                    tale: npc.rejected,
                    author: npc.author,
                    published: false
                },
                items: [],	       // items del npc (tienda);
                title: npc.title,		       // Titulo de la historia
                chapters: [{
                    name: '',
                    story: '',	                // narracion previa a batalla o decision.
                    published: false,
                    write_date: new Date()     // Fecha de creacion
                }],
                author: npc.author,
                published: false,
                write_date: new Date()     // Fecha de creacion
            });
            await newNpc.save();
            const city = await CitiesSchema.updateOne(
                { "places._id": id },
                {
                    $push: {
                        "places.$.events": [newNpc.id]
                    }
                }
            );

            res.json({
                "data": { "npc": newNpc }
            });
        } catch (err) {
            res.json({
                "error": err
            })
        }

    }
    // delete NPCs
    public async deleteNPCs(req: Request, res: Response): Promise<void> {
        const { id, place_id } = req.body;
        try {
            const npcs = await NpcsSchema.deleteOne({
                _id: id
            });
            const city = await CitiesSchema.updateOne(
                { "places._id": place_id },
                {
                    $pull: {
                        "places.$.events": id
                    }
                }
            );
            res.json({
                "data": npcs
            });
        } catch (err) {
            res.json({
                "error": err
            })
        }
    }
    // publicar NPC
    public async publishNPC(req: Request, res: Response): Promise<void> {
        try {
            const { id, published } = req.body;
            const npcs = await NpcsSchema.updateOne(
                { _id: id },
                {
                    published: published,
                    publish_date: (published) ? new Date() : null
                }
            );
            res.json({
                "data": npcs
            });
        } catch (err) {
            res.json({
                "error": err
            })
        }
    }
    // updates NPC
    public async updateNPC(req: Request, res: Response): Promise<void> {
        try {
            const { id, npc } = req.body;
            let updates: any = {};
            if (npc.name) updates.name = npc.name;
            if (npc.description) updates.description = npc.description;
            if (npc.meeting) updates.meeting = npc.meeting;
            if (npc.decision) updates.decision = npc.decision;
            if (npc.items) updates.items = npc.items;
            if (npc.rejected) updates.rejected = npc.rejected;
            if (npc.title) updates.title = npc.title;

            const npcs = await NpcsSchema.updateOne(
                { _id: id },
                {
                    $set: updates
                    
                }
            );
            res.json({
                "data": npcs
            });
        } catch (err) {
            res.json({
                "error": err
            })
        }
    }

    /**
        // add City Description
        public async addCityDescription(req: Request, res: Response): Promise<void> {
            try {
                const { id, tale, author } = req.body;
                const city = await NpcsSchema.updateOne(
                    { _id: id },
                    {
                        $push: {
                            description: [{
                                tale: tale,
                                author: author,
                                published: false,
                                write_date: new Date()
                            }]
                        }
                    }
                );
                res.json({
                    "data": city
                });
            } catch (err) {
                res.json({
                    "error": err
                })
            }
        }
        // remove City Description
        public async removeCityDescription(req: Request, res: Response): Promise<void> {
            try {
                const { id } = req.body;
                const city = await NpcsSchema.updateOne(
                    { "description._id": id },
                    {
                        $pull: {
                            description: {
                                _id: id
                            }
                        }
                    }
                );
                res.json({
                    "data": city
                });
            } catch (err) {
                res.json({
                    "error": err
                })
            }
        }
    */

}


export const npcsController = new NpcsController();
