import { Request, Response } from 'express';
import NpcsSchema, { NpcInterface, ChapterInterface } from '../schemas/npcs.model';
import { decisionOption } from '../schemas/common.model';

class ChaptersController {


    // get all npcs of a places
    public async getAllChapters(req: Request, res: Response) {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('*************** getAllChapters *******************');
            const { id, published } = req.body;
            console.log('> npcId:', id);
            const npcs: NpcInterface | null = await NpcsSchema.findOne(
                {
                    _id: id,
                },
                {
                    title: 1,
                    chapters: 1
                }
            ).lean();
            let filterChapters = (npcs) ? npcs.chapters : [];
            console.log('> story name:', npcs && npcs.title);
            if (published && npcs) {
                filterChapters = (npcs.chapters) ? npcs.chapters.filter(npc => npc.published == true) : [];
            }

            const castChapters = (filterChapters) ? filterChapters.map((c) => ({
                ...c,
                id: c._id,
                usersDecisions: {
                    ...c.usersDecisions,
                    options: c.usersDecisions && c.usersDecisions.options.map(o=> ({...o, id: o._id}))
                }
            })) : null;

            console.log('_____________________________________________________');
            res.json({
                "data": { "chapters": castChapters }
            })
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }

    // updates/add Chapters
    public async updateChapter(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('*************** updateChapter *******************');

            const { chapter } = req.body;

            let setUpdates: any = {};
            let pullUpdates: any = {};
            let arrayFilters: any = null;


            // **** Modificaciones, opcionales

            if (chapter.name) {
                setUpdates['chapters.$.name'] = chapter.name;
            }
            if (chapter.story) {
                setUpdates['chapters.$.story'] = chapter.story;
                if (chapter.author) {
                    setUpdates['chapters.$.author'] = chapter.author;
                    setUpdates['chapters.$.writeDate'] = new Date();
                }

            }
            if (chapter.item) {
                setUpdates['chapters.$.item'] = chapter.item;
            }
            if (chapter.endLocation) {
                setUpdates['chapters.$.endLocation'] = chapter.endLocation;
            }
            // editar las decisiones
            if (chapter.usersDecisions) {

                setUpdates['chapters.$.usersDecisions.decisionType'] = chapter.usersDecisions.decisionType;
                setUpdates['chapters.$.usersDecisions.amount'] = chapter.usersDecisions.amount;
                setUpdates['chapters.$.usersDecisions.item'] = chapter.usersDecisions.item;
                // las Decisiones generan otros capitulos 
                for (const option of (chapter.usersDecisions.options)) {
                    // la edicione tiene id, significa que edito existente.
                    if (option["id"]) {
                        const i = chapter.usersDecisions.options.indexOf(option);
                        console.log('> option vieja', i);
                        setUpdates['chapters.$.usersDecisions.options.$[elem'+i+'].description'] = option.description;
                        setUpdates['chapters.$.usersDecisions.options.$[elem'+i+'].name'] = option.name;
                        setUpdates['chapters.$.usersDecisions.options.$[elem'+i+'].value'] = option.value;
                        if(!arrayFilters){
                            arrayFilters = { arrayFilters: [{ ["elem"+i+"._id"]: option.id }] }                            
                        } else {
                            arrayFilters.arrayFilters.push({ ["elem"+i+"._id"]: option.id });
                        }
                    } else {

                        console.log('> new option');
                        // la decision no tiene id, agrego nueva decision y capitulo.
                        if (!option.value) {
                            const newChapter = await NpcsSchema.updateOne(
                                { "chapters._id": chapter.id },
                                {
                                    $push: {
                                        chapters: [{
                                            name: '',
                                            story: '',	                // narracion previa a batalla o decision.
                                            published: false,
                                            writeDate: new Date()     // Fecha de creacion
                                        }]
                                    }
                                }
                            );
                            const npc: NpcInterface | null = await NpcsSchema.findOne({ "chapters._id": chapter.id }, { chapters: 1 }).lean();
                            if (npc && npc.chapters) {
                                option.value = npc.chapters[npc.chapters.length - 1]._id
                            }
                            console.log('> new chapterId: ', option.value);
                        }
                        if(!pullUpdates['chapters.$.usersDecisions.options']) {
                            pullUpdates['chapters.$.usersDecisions.options'] = [];
                        }
                        pullUpdates['chapters.$.usersDecisions.options'].push({
                            "description": option.description,
                            "name": option.name,
                            "value": option.value,
                            "published": option.published,
                            "removeItem": option.removeItem
                        });
                    }
                }

            }

            const updates: any = {};

            if (Object.keys(setUpdates).length > 0) updates['$set'] = setUpdates;
            if (Object.keys(pullUpdates).length > 0) updates['$push'] = pullUpdates;

            const npcs = await NpcsSchema.updateOne(
                { "chapters._id": chapter.id },
                updates, arrayFilters
            ).lean();

            const findChapter: NpcInterface | null = await NpcsSchema.findOne(
                { "chapters._id": chapter.id },
                {
                    "chapters": 1
                }
            ).lean();

            // console.log("> capitulos", findChapter)
            const castChapter = (findChapter && findChapter.chapters) ? findChapter.chapters.find(c => c._id == chapter.id) : null;
            console.log('> response: ', castChapter && castChapter.name);
            console.log('_____________________________________________________');
            res.json({
                "data": { chapter: castChapter ? { ...castChapter, id: castChapter._id } : null }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }

    // delete Chapter
    public async deleteChapter(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('**************** deleteChapter *******************');
            const { id } = req.body;
            console.log('> placeId: ' + id);

            const choices = await NpcsSchema.updateOne(
                { "chapters._id": id },
                {
                    $pull: {
                        "chapters.$[elem].usersDecisions.options": {
                            value: id
                        }
                    }
                }
                , { arrayFilters: [{ "elem._id": { $nin: [id] } }] }
            ).lean();
            console.log('> choices edition:', choices)
            const edition = await NpcsSchema.updateOne(
                { "chapters._id": id },
                {
                    $pull: {
                        chapters: {
                            _id: id
                        }
                    }
                }
            );
            console.log('===================== ' + ((edition.nModified) ? 'OK' : 'not Found') + ' ======================');
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

    // publicar Chapter
    public async publishChapter(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('**************** publishChapter *******************');
            const { id, published } = req.body;
            console.log('> chapterId: ' + id);
            console.log('> Publish Status: ' + published);
            const chapterEdition = await NpcsSchema.updateOne(
                { "chapters._id": id },
                {
                    $set: {
                        "chapters.$.published": published,
                        "chapters.$.publishDate": (published) ? new Date() : null
                    }
                }
            ).lean();
            console.log('> chapterEdition: ', chapterEdition)
            const edition = await NpcsSchema.updateOne(
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
            console.log('> response: ' + ((edition.nModified) ? 'OK' : 'not Found'));
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

}


export const chaptersController = new ChaptersController();
