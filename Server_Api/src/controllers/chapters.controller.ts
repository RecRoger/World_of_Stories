import { Request, Response } from 'express';
import NpcsSchema, { NpcInterface, ChapterInterface } from '../models/npcs.model';
import { decisionOption } from '../models/common.model';

class ChaptersController {


    // get all npcs of a places
    public async getAllChapters(req: Request, res: Response) {
        const { id, published } = req.body;
        try {
            const npcs: NpcInterface | null = await NpcsSchema.findOne(
                {
                    _id: id,
                },
                {
                    chapters: 1,
                }
            );
            let filterChapters = (npcs) ? npcs.chapters : [];
            if (published && npcs) {
                filterChapters = (npcs.chapters) ? npcs.chapters.filter(npc => npc.published == true) : [];
            }
            res.json({
                "data": { "npcs": filterChapters }
            })
        } catch (err) {
            res.json({
                "error": err
            })
        }
    }

    // updates/add Chapters
    public async updateChapter(req: Request, res: Response): Promise<void> {
        try {
            const { chapter } = req.body;

            let setUpdates: any = {};
            let pullUpdates: any = {};
            let arrayFilters: any = null;


            // **** Modificaciones, opcionales

            // if(chapter.itemsDecisions)
            // considerar
            // if(chapter.tipo de batalla)
            // if(chapter.enemigo)
            // if(chapter.defeat)
            if (chapter.name) {
                setUpdates['chapters.$.name'] = chapter.name;
            }
            if (chapter.story) {
                setUpdates['chapters.$.story'] = chapter.story;
                if (chapter.author) {
                    setUpdates['chapters.$.author'] = chapter.author;
                    setUpdates['chapters.$.write_date'] = new Date();
                }

            }
            if (chapter.item) {
                setUpdates['chapters.$.item'] = chapter.item;
            }
            if (chapter.end_location) {
                setUpdates['chapters.$.end_location'] = chapter.end_location;
            }
            // editar las decisiones
            if (chapter.usersDecisions) {
                // las Decisiones generan otros capitulos 
                for (const option of (<decisionOption[]>chapter.usersDecisions)) {

                    // la edicione tiene id, significa que edito existente.
                    if (option["_id"]) {
                        setUpdates['chapters.$.usersDecisions.$[elem].description'] = option.description;
                        setUpdates['chapters.$.usersDecisions.$[elem].name'] = option.name;
                        setUpdates['chapters.$.usersDecisions.$[elem].value'] = option.value;
                        arrayFilters = { arrayFilters: [{ "elem._id": option._id }] }
                    } else {

                        // la decision no tiene id, agrego nueva decision y capitulo.
                        if (!option.value) {
                            const newChapter = await NpcsSchema.update(
                                { "chapters._id": chapter.id },
                                {
                                    $push: {
                                        chapters: [{
                                            name: '',
                                            story: '',	                // narracion previa a batalla o decision.
                                            published: false,
                                            write_date: new Date()     // Fecha de creacion
                                        }]
                                    }
                                }
                            );
                            const npc: NpcInterface | null = await NpcsSchema.findOne({ "chapters._id": chapter.id }, { chapters: 1 })
                            if (npc && npc.chapters) {
                                option.value = npc.chapters[npc.chapters.length - 1]._id
                            }
                        }
                        pullUpdates['chapters.$.usersDecisions'] = {
                            "description": option.description,
                            "name": option.name,
                            "value": option.value
                        }
                    }
                }

            }

            const updates: any = {};

            if (Object.keys(setUpdates).length > 0) updates['$set'] = setUpdates;
            if (Object.keys(pullUpdates).length > 0) updates['$push'] = pullUpdates;

            const npcs = await NpcsSchema.updateOne(
                { "chapters._id": chapter.id },
                updates, arrayFilters
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

    // delete Chapter
    public async deleteChapter(req: Request, res: Response): Promise<void> {
        const { id } = req.body;
        try {

            const choices = await NpcsSchema.updateOne(
                { "chapters._id": id },
                {
                    $pull: {
                        "chapters.$[elem].usersDecisions": {
                            value: id
                        }
                    }
                }
                , { arrayFilters: [{ "elem._id": { $nin: [id] } }] }
            );
            const chapters = await NpcsSchema.updateOne(
                { "chapters._id": id },
                {
                    $pull: {
                        chapters: {
                            _id: id
                        }
                    }
                }
            );
            res.json({
                "data": chapters
            });
        } catch (err) {
            res.json({
                "error": err
            })
        }
    }

    // publicar Chapter
    public async publishChapter(req: Request, res: Response): Promise<void> {
        try {
            const { id, published } = req.body;
            const chapters = await NpcsSchema.updateOne(
                { "chapters._id": id },
                {
                    $set: {
                        "chapters.$.published": published,
                        "chapters.$.publish_date": (published) ? new Date() : null
                    }
                }
            );
            const choices = await NpcsSchema.updateOne(
                { "chapters._id": id },
                {
                    $set: {
                        "chapters.$[elem].usersDecisions.$[choice].published": published
                    }
                }, {
                    arrayFilters: [
                        {
                            "elem._id": { $nin: [id] }
                        },
                        {
                            "choice.value": id
                        }
                    ]
                }
            );
            res.json({
                "data": chapters
            });
        } catch (err) {
            res.json({
                "error": err
            })
        }
    }



    /**
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


export const chaptersController = new ChaptersController();
