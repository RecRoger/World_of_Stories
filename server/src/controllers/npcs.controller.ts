import { Request, Response } from 'express';
import Npcs, { NpcInterface } from '../schemas/npcs.model.js';
import Cities from '../schemas/cities.model.js';
import { logError } from './common-logs.js';


const formatNpc = (npc: any) => {
    if (!npc) return null;
    return {
        ...npc,
        id: npc._id,
        description: npc.description ? { ...npc.description, id: npc.description._id } : {},
        meeting: npc.meeting ? { ...npc.meeting, id: npc.meeting._id } : {},
        rejected: npc.rejected ? { ...npc.rejected, id: npc.rejected._id } : {},
        chapters: npc.chapters ? npc.chapters.map((ch: any) => ({ ...ch, id: ch._id })) : []
    };
};


// get all npcs of a places
export const getAllNPCs = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { placeId } = req.params;
        const published = req.query.published === 'true'; // Se extrae limpiamente por Query String
        console.log(`[GET] - getAllNPCs para el lugar: ${placeId} (filtro de published: ${published}) - ${new Date().toISOString()}`);

        // Busca la ciudad que contiene el lugar indicado en su array de places
        const city = await Cities.findOne(
            { "places._id": placeId },
            { places: 1 }
        ).lean();

        if (!city) {
            return res.status(404).json({ ok: false, message: 'No se encontró la ciudad o el lugar especificado.' });
        }

        const place = city.places.find((p: any) => p._id.toString() === placeId);
        if (!place) {
            return res.status(404).json({ ok: false, message: 'Lugar no encontrado dentro de la ciudad.' });
        }

        const ids = place.events || [];

        // Filtro base utilizando los IDs acumulados en events
        const query: any = { _id: { $in: ids } };
        if (req.query.published !== undefined) {
            query.published = published;
        }

        const npcs = await Npcs.find(query, { chapters: 0 }).lean();

        return res.status(200).json({
            ok: true,
            data: {
                npcs: npcs.map(npc => formatNpc(npc))
            }
        });
    } catch (err) {
        console.error('[Error] - getAllNPCs:', err);
        return logError(res, err, 'Error interno del servidor al intentar consultar todos los npcs del lugar');
    }
};

// get get complete NPC y ID
export const getOneNPC = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { npcId } = req.params;
        console.log(`[GET] - getOneNPC para el lugar: ${npcId} - ${new Date().toISOString()}`);

        const npc = await Npcs.findById(npcId, { chapters: 0 }).lean();

        if (!npc) {
            return res.status(404).json({ ok: false, message: 'NPC no encontrado o no publicado.' });
        }

        return res.status(200).json({
            ok: true,
            data: { npc: formatNpc(npc) }
        });
    } catch (err) {
        console.error('[Error] - getOneNPC:', err);
        return logError(res, err, 'Error interno del servidor al intentar consultar el npcs');
    }
};


// save new NPC
export const saveNPC = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { placeId } = req.params;
        const { npc } = req.body;
        console.log(`[POST] - saveNPC ${npc?.name} para el lugar: ${placeId} - ${new Date().toISOString()}`);
        if (!npc) {
            return res.status(400).json({ ok: false, message: 'Faltan los datos del NPC en el cuerpo de la petición.' });
        }

        const newNpc = new Npcs({
            name: npc.name,
            npcType: npc.npcType,
            description: {
                tale: npc.description,
                author: npc.author,
                published: false,
                writeDate: new Date()
            },
            meeting: {
                tale: npc.meeting,
                author: npc.author,
                published: false,
                writeDate: new Date()
            },
            decision: {
                decisionType: npc.decision?.decisionType || 'choose',
                amount: npc.decision?.amount || 0,
                item: npc.decision?.item || '',
                options: npc.decision?.options || []
            },
            rejected: {
                tale: npc.rejected,
                author: npc.author,
                published: false,
                writeDate: new Date()
            },
            items: npc.items || [],
            title: npc.title,
            chapters: [{
                name: 'Inicio',
                story: [],
                endLocation: { endChapter: true },
                published: false,
                writeDate: new Date()
            }],
            author: npc.author,
            published: false,
            writeDate: new Date()
        });
        await newNpc.save();

        const placeEdition = await Cities.updateOne(
            { "places._id": placeId },
            { $push: { "places.$.events": newNpc._id } }
        );

        if (placeEdition.matchedCount === 0) {
            return res.status(404).json({ ok: false, message: 'No se pudo asociar el NPC porque el lugar no existe.' });
        }

        return res.status(201).json({
            ok: true,
            data: { npc: formatNpc(newNpc.toJSON()) }
        });
    } catch (err) {
        console.error('[Error] - saveNPC:', err);
        return logError(res, err, 'Error interno del servidor al intentar crear el npcs');
    }

}

// updates NPC
export const updateNPC = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { npcId } = req.params;
        const { npc } = req.body;
        console.log(`[PATCH] - updateNPC ${npcId} - ${new Date().toISOString()}`);

        if (!npc) {
            return res.status(400).json({ ok: false, message: 'Faltan los datos de actualización.' });
        }

        let updates: any = {};
        if (npc.name) updates.name = npc.name;
        if (npc.title) updates.title = npc.title;
        if (npc.npcType) updates.npcType = npc.npcType;
        if (npc.items) updates.items = npc.items;

        if (npc.description) {
            updates['description.tale'] = npc.description;
            updates['description.author'] = npc.author;
        }
        if (npc.meeting) {
            updates['meeting.tale'] = npc.meeting;
            updates['meeting.author'] = npc.author;
        }
        if (npc.rejected) {
            updates['rejected.tale'] = npc.rejected;
            updates['rejected.author'] = npc.author;
        }

        if (npc.decision) {
            updates['decision.decisionType'] = npc.decision.decisionType;
            updates['decision.amount'] = npc.decision.amount;
            updates['decision.item'] = npc.decision.item;
            updates['decision.options'] = npc.decision.options || [];
        }

        const edition = await Npcs.updateOne({ _id: npcId }, { $set: updates });

        if (edition.matchedCount === 0) {
            return res.status(404).json({ ok: false, message: 'No se encontró el NPC para actualizar.' });
        }

        const editedNpc = await Npcs.findById(npcId, { chapters: 0 }).lean();

        return res.status(200).json({
            ok: true,
            data: { npc: formatNpc(editedNpc) }
        });
    } catch (err) {
        console.error('[Error] - updateNPC:', err);
        return logError(res, err, 'Error interno del servidor al intentar modificar el npcs');
    }
};

// delete NPCs
export const deleteNPCs = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { npcId } = req.params; // ¡Chau placeId!
        console.log(`[DELETE] - deleteNPCs ${npcId} - ${new Date().toISOString()}`);

        // 1. Eliminamos el NPC de su propia colección
        const deletion = await Npcs.deleteOne({ _id: npcId });

        if (deletion.deletedCount === 0) {
            return res.status(404).json({ ok: false, message: 'El NPC que intentas eliminar no existe.' });
        }

        // 2. Buscamos y removemos el NPC de CUALQUIER lugar de CUALQUIER ciudad de forma global
        await Cities.updateOne(
            { "places.events": npcId }, // Busca la ciudad que tenga un lugar con este npcId en sus eventos
            { $pull: { "places.$.events": npcId } } // El operador $ identifica automáticamente cuál lugar coincidió
        );

        return res.status(200).json({
            ok: true,
            message: 'NPC eliminado y desvinculado de su lugar de origen correctamente.'
        });
    } catch (err) {
        console.error('[Error] - deleteNPCs:', err);
        return logError(res, err, 'Error interno del servidor al intentar borrar el npc');
    }
};

// publicar NPC
export const publishNPC = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { npcId } = req.params;
        const { published } = req.body;
        console.log(`[PATCH] - publishNPC ${npcId} - ${new Date().toISOString()}`);

        const edition = await Npcs.updateOne(
            { _id: npcId },
            {
                $set: {
                    published: published,
                    publishDate: published ? new Date() : null
                }
            }
        );

        if (edition.matchedCount === 0) {
            return res.status(404).json({ ok: false, message: 'NPC no encontrado para publicar.' });
        }

        return res.status(200).json({
            ok: true,
            message: published ? 'NPC publicado con éxito.' : 'NPC despublicado con éxito.'
        });
    } catch (err) {
        console.error('[Error] - publishNPC:', err);
        return logError(res, err, 'Error interno del servidor al intentar publicar el npcs');
    }
};
