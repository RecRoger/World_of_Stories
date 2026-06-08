// src/controllers/chapters.controller.ts
import { Request, Response } from 'express';
import NpcsSchema, { NpcInterface, ChapterInterface } from '../schemas/npcs.model.js';
import { logError } from './common-logs.js';

const formatChapter = (chapter: any) => {
    if (!chapter) return null;
    return {
        ...chapter,
        id: chapter._id,
        usersDecisions: chapter.usersDecisions ? {
            ...chapter.usersDecisions,
            options: chapter.usersDecisions.options
                ? chapter.usersDecisions.options.map((o: any) => ({ ...o, id: o._id }))
                : []
        } : undefined
    };
};

// get all chapters of an NPC
export const getAllChapters = async (req: Request, res: Response): Promise<Response> => {
    const { npcId } = req.params;
    const published = req.query.published === 'true';
    console.log(`[GET] - getAllChapters para el NPC: ${npcId} (filtro de published: ${published}) - ${new Date().toISOString()}`);

    try {
        const npc: NpcInterface | null = await NpcsSchema.findById(npcId, {
            title: 1,
            chapters: 1
        }).lean<NpcInterface | null>();

        if (!npc) {
            return res.status(404).json({ ok: false, message: 'No se encontró el NPC especificado.' });
        }

        let filterChapters = npc.chapters || [];
        if (req.query.published !== undefined) {
            filterChapters = filterChapters.filter(ch => ch.published === published);
        }

        const castChapters = filterChapters.map(c => ({
            id: c._id,
            name: c.name,
            published: c.published,
            author: c.author,
            writeDate: c.writeDate,
            publishDate: c.publishDate
        }));

        return res.status(200).json({
            ok: true,
            data: { chapters: castChapters }
        });
    } catch (err) {
        console.error('[Error] - getAllChapters:', err);
        return logError(res, err, 'Error interno del servidor al intentar consultar los capítulos del NPC');
    }
};

// get chapters info
export const getChapter = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    console.log(`[GET] - getChapter para el ID: ${id} - ${new Date().toISOString()}`);

    try {
        const npc: NpcInterface | null = await NpcsSchema.findOne(
            { "chapters._id": id },
            { title: 1, chapters: 1 }
        ).lean<NpcInterface | null>();

        if (!npc || !npc.chapters) {
            return res.status(404).json({ ok: false, message: 'No se encontró el capítulo solicitado.' });
        }

        const chapter = npc.chapters.find((n: ChapterInterface) => n._id.toString() === id);
        if (!chapter) {
            return res.status(404).json({ ok: false, message: 'Capítulo no encontrado dentro del árbol del NPC.' });
        }

        return res.status(200).json({
            ok: true,
            data: { chapter: formatChapter(chapter) }
        });
    } catch (err) {
        console.error('[Error] - getChapter:', err);
        return logError(res, err, 'Error interno del servidor al intentar consultar el capítulo');
    }
};


// updates/add Chapters
export const updateChapter = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { chapter } = req.body;
    console.log(`[PUT] - updateChapter para el ID: ${id} - ${new Date().toISOString()}`);

    if (!chapter) {
        return res.status(400).json({ ok: false, message: 'Faltan los datos del capítulo en el cuerpo de la petición.' });
    }

    try {
        let setUpdates: any = {};
        let pushUpdates: any = {};
        let arrayFilters: any = null;

        if (chapter.name) setUpdates['chapters.$.name'] = chapter.name;
        if (chapter.item) setUpdates['chapters.$.item'] = chapter.item;
        if (chapter.endLocation) setUpdates['chapters.$.endLocation'] = chapter.endLocation;

        if (chapter.story) {
            setUpdates['chapters.$.story'] = chapter.story;
            if (chapter.author) {
                setUpdates['chapters.$.author'] = chapter.author;
                setUpdates['chapters.$.writeDate'] = new Date();
            }
        }

        if (chapter.usersDecisions) {
            setUpdates['chapters.$.usersDecisions.decisionType'] = chapter.usersDecisions.decisionType;
            setUpdates['chapters.$.usersDecisions.amount'] = chapter.usersDecisions.amount;
            setUpdates['chapters.$.usersDecisions.item'] = chapter.usersDecisions.item;

            for (const option of chapter.usersDecisions.options) {
                // Si la opción elegida carece de valor de destino, creamos la pre-estructura del nuevo capítulo hijo
                if (!option.value) {
                    await NpcsSchema.updateOne(
                        { "chapters._id": id },
                        {
                            $push: {
                                chapters: [{
                                    name: option.name,
                                    story: [],
                                    endLocation: { endChapter: true },
                                    published: false,
                                    writeDate: new Date()
                                }]
                            }
                        }
                    );

                    const npc: NpcInterface | null = await NpcsSchema.findOne({ "chapters._id": id }, { chapters: 1 }).lean<NpcInterface | null>();
                    if (npc && npc.chapters) {
                        option.value = npc.chapters[npc.chapters.length - 1]._id;
                    }
                }

                if (option.id) {
                    const i = chapter.usersDecisions.options.indexOf(option);
                    setUpdates[`chapters.$.usersDecisions.options.$[elem${i}].description`] = option.description;
                    setUpdates[`chapters.$.usersDecisions.options.$[elem${i}].name`] = option.name;
                    setUpdates[`chapters.$.usersDecisions.options.$[elem${i}].value`] = option.value;

                    if (!arrayFilters) {
                        arrayFilters = { arrayFilters: [{ [`elem${i}._id`]: option.id }] };
                    } else {
                        arrayFilters.arrayFilters.push({ [`elem${i}._id`]: option.id });
                    }
                } else {
                    if (!pushUpdates['chapters.$.usersDecisions.options']) {
                        pushUpdates['chapters.$.usersDecisions.options'] = [];
                    }
                    pushUpdates['chapters.$.usersDecisions.options'].push({
                        description: option.description,
                        name: option.name,
                        value: option.value,
                        published: option.published || false,
                        removeItem: option.removeItem || false
                    });
                }
            }
        }

        const updates: any = {};
        if (Object.keys(setUpdates).length > 0) updates['$set'] = setUpdates;
        if (Object.keys(pushUpdates).length > 0) updates['$push'] = pushUpdates;

        const dbResult = await NpcsSchema.updateOne({ "chapters._id": id }, updates, arrayFilters);

        if (dbResult.matchedCount === 0) {
            return res.status(404).json({ ok: false, message: 'No se encontró el capítulo solicitado para actualizar.' });
        }

        const findChapter: NpcInterface | null = await NpcsSchema.findOne({ "chapters._id": id }, { chapters: 1 }).lean<NpcInterface | null>();
        const castChapter = (findChapter && findChapter.chapters) ? findChapter.chapters.find((c: ChapterInterface) => c._id.toString() === id) : null;

        return res.status(200).json({
            ok: true,
            data: { chapter: formatChapter(castChapter) }
        });
    } catch (err) {
        console.error('[Error] - updateChapter:', err);
        return logError(res, err, 'Error interno del servidor al intentar modificar el capítulo');
    }
};

// delete Chapter
export const deleteChapter = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    console.log(`[DELETE] - deleteChapter para el ID: ${id} - ${new Date().toISOString()}`);

    try {
        await NpcsSchema.updateOne(
            { "chapters._id": id },
            {
                $pull: {
                    "chapters.$[elem].usersDecisions.options": { value: id }
                }
            },
            { arrayFilters: [{ "elem._id": { $nin: [id] } }] }
        );

        const edition = await NpcsSchema.updateOne(
            { "chapters._id": id },
            {
                $pull: { chapters: { _id: id } }
            }
        );

        if (edition.modifiedCount === 0) {
            return res.status(404).json({ ok: false, message: 'El capítulo no existía o no pudo ser desvinculado.' });
        }

        return res.status(200).json({
            ok: true,
            message: 'Capítulo eliminado y referencias desvinculadas con éxito.'
        });
    } catch (err) {
        console.error('[Error] - deleteChapter:', err);
        return logError(res, err, 'Error interno del servidor al intentar borrar el capítulo');
    }
};

// publicar Chapter
export const publishChapter = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    const { published } = req.body;
    console.log(`[PATCH] - publishChapter para el ID: ${id} (Estado: ${published}) - ${new Date().toISOString()}`);

    try {
        const chapterEdition = await NpcsSchema.updateOne(
            { "chapters._id": id },
            {
                $set: {
                    "chapters.$.published": published,
                    "chapters.$.publishDate": published ? new Date() : null
                }
            }
        );

        if (chapterEdition.matchedCount === 0) {
            return res.status(404).json({ ok: false, message: 'Capítulo no encontrado para publicar.' });
        }
        await NpcsSchema.updateOne(
            { "chapters._id": id },
            {
                $set: {
                    "chapters.$[elem].usersDecisions.options.$[choice].published": published
                }
            },
            {
                arrayFilters: [
                    { "elem._id": { $nin: [id] } },
                    { "choice.value": id }
                ]
            }
        );
        return res.status(200).json({
            ok: true,
            message: published ? 'Capítulo y ramificaciones publicados correctamente.' : 'Capítulo y ramificaciones despublicados correctamente.'
        });
    } catch (err) {
        console.error('[Error] - publishChapter:', err);
        return logError(res, err, 'Error interno del servidor al intentar cambiar el estado de publicación del capítulo');
    }
};