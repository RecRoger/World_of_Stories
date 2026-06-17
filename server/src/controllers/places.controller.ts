import { Request, Response } from 'express';
import Cities, { CityInterface, PlaceInterface } from '../schemas/cities.model.js';
import mongoose from 'mongoose';
import { logError } from './common-logs.js';
import { TaleInterface } from '../schemas/tale.model.js';

// get all places of a city
export const getCityPlaces = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { cityId } = req.params;
        const { published } = req.query;
        console.log(`[GET] - getCityPlaces para la ciudad: ${cityId} (Filtro published: ${published}) - ${new Date().toISOString()}`);
        const city = await Cities.findById(cityId).select(
            '-places.description -places.entry -places.events'
        );
        if (!city) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontró la ciudad especificada para listar sus lugares.'
            });
        }

        let responsePlaces = city.places;
        if (published === 'true') {
            responsePlaces = city.places.filter(place => place.published === true);
        }

        return res.status(200).json({
            ok: true,
            count: responsePlaces.length,
            data: {
                places: responsePlaces
            }
        });

    } catch (err) {
        console.error('[Error] - getCityPlaces:', err);
        return logError(res, err, 'Error interno del servidor al recuperar los lugares de la ciudad');
    }
};

// get get complete place
export const getOnePlace = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { placeId } = req.params; // O req.body.id, según prefieras en tu ruta

        console.log(`[GET] - getOnePlace (Mongoose Nativo) para ID: ${placeId}`);

        // 1. Buscamos la ciudad que contiene el lugar. Traemos solo el array 'places'
        // Quitamos .lean() para que Mongoose instancie los documentos y los Virtuals funcionen
        const city = await Cities.findOne({ "places._id": placeId }, { places: 1 });

        if (!city) {
            return res.status(404).json({
                ok: false,
                message: 'No se encontró el lugar especificado.'
            });
        }

        // 2. ¡La magia de Mongoose! Usamos .id() sobre el array instanciado
        // Esto extrae el subdocumento exacto y mantiene vivos sus Virtuals
        const place = city.places.find((p: PlaceInterface) => p._id.toString() === placeId);

        if (!place) {
            return res.status(404).json({
                ok: false,
                message: 'El lugar no existe dentro de la ciudad asociada.'
            });
        }

        // 3. Al responder, toJSON() transformará automáticamente el 'place'
        // inyectando su 'id', y los 'id' de sus 'description' y 'entry'
        return res.status(200).json({
            ok: true,
            data: {
                place
            }
        });

    } catch (err) {
        console.error('[Error] - getOnePlace:', err);
        return logError(res, err, 'Error interno al recuperar el lugar');
    }
};

// save new place in city
export const savePlace = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { cityId } = req.params;
        const { userName, name, description, entry } = req.body;
        console.log(`[POST] - savePlace: ${name} en Ciudad: ${cityId}`);

        const updatedCity = await Cities.findByIdAndUpdate(
            cityId,
            {
                $push: {
                    places: [{
                        name: name,
                        description: [{
                            tale: description,
                            author: userName,
                            published: false,
                            writeDate: new Date()
                        }],
                        entry: [{
                            tale: entry,
                            author: userName,
                            published: false,
                            writeDate: new Date()
                        }],	// cuento de entrada al lugar.
                        events: [],	//    los id's de los NPC's de ese lugar
                        publlished: false
                    }]
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedCity) {
            return res.status(404).json({ ok: false, message: 'No se encontró la ciudad para registrar el lugar.' });
        }

        return res.status(201).json({
            ok: true,
            message: 'Lugar creado exitosamente.',
            data: { place: updatedCity.places.at(-1) } // Retorna el último agregado
        });
    } catch (err) {
        console.error('[Error] - savePlace:', err);
        return logError(res, err, 'Error al intentar guardar el lugar');
    }
};

// delete Place
export const deletePlace = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { cityId, placeId } = req.params;
        console.log(`[PATCH] - deletePlace para Ciudad: ${cityId} -> Lugar: ${placeId}`);

        const updatedCity = await Cities.findByIdAndUpdate(
            cityId,
            { $pull: { places: { _id: placeId } } },
            { new: true }
        );

        if (!updatedCity) {
            return res.status(404).json({ ok: false, message: 'No se encontró la ciudad o el lugar a eliminar.' });
        }

        return res.status(200).json({
            ok: true,
            message: 'El lugar fue eliminado correctamente de la ciudad.',
            data: { city: updatedCity }
        });
    } catch (err) {
        console.error('[Error] - deletePlace:', err);
        return logError(res, err, 'Error al intentar eliminar el lugar');
    }
};


// update Place
export const updatePlace = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { placeId } = req.params;
        const { place } = req.body;
        console.log(`[PATCH] - updatePlace para Lugar: ${placeId}`);
        if (!mongoose.Types.ObjectId.isValid(placeId)) {
            return res.status(400).json({ ok: false, message: 'El ID del lugar provisto no es válido.' });
        }
        if (!place || Object.keys(place).length === 0) {
            return res.status(400).json({ ok: false, message: 'No se enviaron datos para actualizar.' });
        }

        const updateFields: Record<string, any> = {};
        for (const [key, value] of Object.entries(place)) {
            if (key !== '_id') {
                updateFields[`places.$[placeElem].${key}`] = value;
            }
        }

        const updatedCity = await Cities.findOneAndUpdate(
            { "places._id": placeId },
            { $set: updateFields },
            {
                arrayFilters: [{ "placeElem._id": placeId }],
                new: true,
                runValidators: true
            }
        );
        if (!updatedCity) {
            return res.status(404).json({ ok: false, message: 'No se encontró la ciudad o el lugar solicitado.' });
        }
        const targetPlace = updatedCity.places.find((p: any) => p._id.toString() === placeId);
        return res.status(200).json({
            ok: true,
            message: 'Lugar editado correctamente.',
            data: {
                place: targetPlace
            }
        });

    } catch (err) {
        console.error('[Error] - updatePlace:', err);
        // Mantenemos tu logger personalizado para fallos internos
        return logError(res, err, 'Error al actualizar el estado de publicación del lugar');
    }
};

// publicar Place
export const publishPlace = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { placeId } = req.params;
        const { published } = req.body;
        console.log(`[PATCH] - publishPlace para Lugar: ${placeId} (published: ${published})`);

        const updatedCity = await Cities.findOneAndUpdate(
            { "places._id": placeId },
            {
                $set: {
                    "places.$[placeElem].published": published,
                    "places.$[placeElem].publishDate": published ? new Date() : null
                }
            },
            {
                arrayFilters: [{ "placeElem._id": placeId }],
                new: true
            }
        );

        if (!updatedCity) {
            return res.status(404).json({ ok: false, message: 'No se encontró el recurso.' });
        }

        return res.status(200).json({
            ok: true,
            message: `Lugar ${published ? 'publicado' : 'despublicado'} correctamente.`,
            data: { place: updatedCity.places.find((p: PlaceInterface) => p._id.toString() === placeId) }
        });
    } catch (err) {
        console.error('[Error] - publishPlace:', err);
        return logError(res, err, 'Error al actualizar el estado de publicación del lugar');
    }
};

// add Place Description
export const addPlaceDescription = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { placeId } = req.params; // /places/:placeId/description
        const { tale, author } = req.body;

        console.log(`[PATCH] - addPlaceDescription para Lugar ID: ${placeId} - ${new Date().toISOString()}`);

        const updatedCity = await Cities.findOneAndUpdate(
            { "places._id": placeId }, // Encontramos la ciudad que contiene el lugar
            {
                $push: {
                    "places.$[placeElem].description": {
                        tale,
                        author,
                        published: false,
                        writeDate: new Date()
                    }
                }
            },
            {
                arrayFilters: [{ "placeElem._id": placeId }],
                new: true,
                runValidators: true
            }
        );

        if (!updatedCity) {
            return res.status(404).json({ ok: false, message: 'No se encontró el lugar especificado para añadir la descripción.' });
        }

        const place = updatedCity.places.find((p: PlaceInterface) => p._id.toString() === placeId);
        const newTale = place?.description.at(-1);

        return res.status(201).json({
            ok: true,
            message: 'Descripción añadida correctamente al lugar.',
            data: { description: newTale }
        });
    } catch (err) {
        console.error('[Error] - addPlaceDescription:', err);
        return logError(res, err, 'Error interno al añadir la descripción al lugar');
    }
};

// remove Place Description
export const removePlaceDescription = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { placeId, taleId } = req.params; // /places/:placeId/description/:taleId
        console.log(`[PATCH] - removePlaceDescription para Lugar: ${placeId} -> Relato: ${taleId}  - ${new Date().toISOString()}`);

        const updatedCity = await Cities.findOneAndUpdate(
            { "places._id": placeId },
            {
                $pull: {
                    "places.$[placeElem].description": { _id: taleId }
                }
            },
            {
                arrayFilters: [{ "placeElem._id": placeId }],
                new: true
            }
        );
        if (!updatedCity) {
            return res.status(404).json({ ok: false, message: 'No se encontró el recurso para eliminar la descripción.' });
        }

        return res.status(200).json({
            ok: true,
            message: 'Descripción eliminada correctamente del lugar.',
        });
    } catch (err) {
        console.error('[Error] - removePlaceDescription:', err);
        return logError(res, err, 'Error interno al remover la descripción del lugar');
    }
};

// updates/publish Place Description
export const updatePlaceDescription = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { placeId } = req.params; // /places/:placeId/description
        const { description } = req.body; // { id, tale, published }

        console.log(`[PATCH] - updatePlaceDescription para Lugar: ${placeId} -> Relato: ${description?.id} - ${new Date().toISOString()}`);

        const updatedCity = await Cities.findOneAndUpdate(
            { "places._id": placeId },
            {
                $set: {
                    "places.$[placeElem].description.$[taleElem].tale": description.tale,
                    "places.$[placeElem].description.$[taleElem].published": description.published,
                    "places.$[placeElem].description.$[taleElem].publishDate": description.published ? new Date() : null
                }
            },
            {
                arrayFilters: [
                    { "placeElem._id": placeId },
                    { "taleElem._id": description.id }
                ],
                new: true,
                runValidators: true
            }
        );

        if (!updatedCity) {
            return res.status(404).json({ ok: false, message: 'No se encontró el recurso para actualizar.' });
        }

        const updatedTale = updatedCity.places.find(p => p.id === placeId)?.description.find((d: TaleInterface) => d._id.toString() === description.id);

        return res.status(200).json({
            ok: true,
            message: 'Descripción del lugar actualizada correctamente.',
            data: { description: updatedTale }
        });
    } catch (err) {
        console.error('[Error] - updatePlaceDescription:', err);
        return logError(res, err, 'Error interno al actualizar la descripción del lugar');
    }
};


// add Place Entry
export const addPlaceEntry = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { placeId } = req.params;
        const { tale, author } = req.body;
        console.log(`[PATCH] - addPlaceEntry para Lugar ID: ${placeId} - ${new Date().toISOString()}`);
        const updatedCity = await Cities.findOneAndUpdate(
            { "places._id": placeId },
            {
                $push: {
                    "places.$[placeElem].entry": {
                        tale,
                        author,
                        published: false,
                        writeDate: new Date()
                    }
                }
            },
            {
                arrayFilters: [{ "placeElem._id": placeId }],
                new: true,
                runValidators: true
            }
        );
        if (!updatedCity) {
            return res.status(404).json({ ok: false, message: 'No se encontró el lugar para añadir la entrada.' });
        }

        const newEntry = updatedCity.places.find((p: PlaceInterface) => p._id.toString() === placeId)?.entry.at(-1);

        return res.status(201).json({
            ok: true,
            message: 'Cuento de entrada añadido correctamente al lugar.',
            data: { entry: newEntry }
        });
    } catch (err) {
        console.error('[Error] - addPlaceEntry:', err);
        return logError(res, err, 'Error interno al añadir la entrada al lugar');
    }
};
// remove Place Entry
export const removePlaceEntry = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { placeId, taleId } = req.params;
        console.log(`[PATCH] - removePlaceEntry para Lugar: ${placeId} -> Entrada: ${taleId}`);
        const updatedCity = await Cities.findOneAndUpdate(
            { "places._id": placeId },
            {
                $pull: {
                    "places.$[placeElem].entry": { _id: taleId }
                }
            },
            {
                arrayFilters: [{ "placeElem._id": placeId }],
                new: true
            }
        );
        if (!updatedCity) {
            return res.status(404).json({ ok: false, message: 'No se encontró el recurso para eliminar la entrada.' });
        }
        return res.status(200).json({
            ok: true,
            message: 'Cuento de entrada eliminado correctamente.',
            data: { place: updatedCity.places.find(p => p.id = placeId) }
        });
    } catch (err) {
        console.error('[Error] - removePlaceEntry:', err);
        return logError(res, err, 'Error interno al remover la entrada del lugar');
    }
};
// updates/publish Place Description
export const updatePlaceEntry = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { placeId } = req.params;
        const { entry } = req.body; // { id, tale, published }
        console.log(`[PATCH] - updatePlaceEntry para Lugar: ${placeId} -> Entrada: ${entry?.id}`);
        const updatedCity = await Cities.findOneAndUpdate(
            { "places._id": placeId },
            {
                $set: {
                    "places.$[placeElem].entry.$[taleElem].tale": entry.tale,
                    "places.$[placeElem].entry.$[taleElem].published": entry.published,
                    "places.$[placeElem].entry.$[taleElem].publishDate": entry.published ? new Date() : null
                }
            },
            {
                arrayFilters: [
                    { "placeElem._id": placeId },
                    { "taleElem._id": entry.id }
                ],
                new: true,
                runValidators: true
            }
        );
        if (!updatedCity) {
            return res.status(404).json({ ok: false, message: 'No se encontró el recurso para actualizar.' });
        }
        const updatedEntry = updatedCity.places.find((p: PlaceInterface) => p._id.toString() === placeId)?.entry
            .find((e: TaleInterface) => e._id.toString() === entry.id);
        return res.status(200).json({
            ok: true,
            message: 'Cuento de entrada actualizado correctamente.',
            data: { entry: updatedEntry }
        });
    } catch (err) {
        console.error('[Error] - updatePlaceEntry:', err);
        return logError(res, err, 'Error interno al actualizar la entrada del lugar');
    }
};