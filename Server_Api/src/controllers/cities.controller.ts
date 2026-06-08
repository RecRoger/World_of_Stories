import { Request, Response } from 'express';
import Cities, { CityInterface } from '../schemas/cities.model.js';
import { logError } from './common-logs.js';
import { TaleInterface } from '../schemas/tale.model.js';


// get all cities without places
export const getAllCities = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { published } = req.query; // Captura el query string de la URL
        console.log(`[GET] - getAllCities (filtro de published: ${published})- ${new Date().toISOString()}`);


        // 1. Construimos el filtro dinámico de forma limpia
        const filter: any = {};
        if (published === 'true') filter.published = true;
        if (published === 'false') filter.published = false;

        // 2. Buscamos quitando el .lean() para que actúen los Virtuals automáticos.
        // Proyectamos solo los campos necesarios del listado principal.
        const cities = await Cities.find(filter).select(
            'name published publishDate' // Excluimos automáticamente description, travel y places
        );

        // 3. Respondemos directo. 'id' aparecerá mágicamente en el JSON gracias a toJSON: { virtuals: true }
        return res.status(200).json({
            ok: true,
            count: cities.length,
            data: {
                cities
            }
        });

    } catch (err) {
        console.error('[Error] - getAllCities:', err);
        return logError(res, err, 'Error interno del servidor al recuperar las ciudades');
    }
};

// get get complete city
export const getOneCity = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        console.log(`[GET] - getOneCity - para: ${id} - ${new Date().toISOString()}`);
        const city = await Cities.findById(id).select('-places');

        if (!city) {
            console.log(`[GET] - getOneCity - city ${id} not found`);
            return res.status(404).json({
                ok: false,
                message: `No se encontró ninguna ciudad con el ID "${id}".`
            });
        }

        return res.status(200).json({
            ok: true,
            data: {
                city
            }
        });
    } catch (err) {
        console.error('[Error] - getOneCity', err);
        return logError(res, err, 'Error interno del servidor al recuperar una ciudad',)
    }
}

// save new City
export const saveCity = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { userName, name, description, travel } = req.body;
        console.log(`[POST] - saveCity para: ${name} by ${userName} - ${new Date().toISOString()}`);

        const cityExists = await Cities.findOne({ name }).lean();
        if (cityExists) {
            console.log(`[POST] - saveCity - ${name} already exist`);
            return res.status(409).json({
                ok: false,
                message: `La ciudad con el nombre "${name}" ya se encuentra registrada.`
            });
        }

        const newCity = new Cities({
            name,
            description: [{
                tale: description,
                author: userName,
                published: false
            }],
            travel: [{
                tale: travel,
                author: userName,
                published: false
            }],
            places: [],
            published: false
        });

        await newCity.save();

        return res.status(201).json({
            ok: true,
            message: 'Ciudad creada exitosamente.',
            data: {
                city: newCity
            }
        });
    } catch (err) {
        console.error('[Error] - saveCity', err);
        return logError(res, err, 'Error interno del servidor al guardar el ciudad')
    }
}

// delete City
export const deleteCity = async (req: Request, res: Response): Promise<Response> => {
    const { id } = req.params;
    console.log(`[DELETE] - deleteCity para el ID: ${id} - ${new Date().toISOString()}`);
    try {
        const deletedCity = await Cities.findByIdAndDelete(id).lean();

        if (!deletedCity) {
            console.log(`[DELETE] - deleteCity - City not found`);
            return res.status(404).json({
                ok: false,
                message: `No se pudo eliminar: No se encontró ninguna ciudad con el ID "${id}".`
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Ciudad eliminada correctamente de la base de datos.',
            data: {
                user: {
                    id: deletedCity._id,
                    name: deletedCity.name,
                }
            }
        });
    } catch (err) {
        console.error('[Error] - deleteCity:', err);
        return logError(res, err, 'Error interno del servidor al intentar eliminar la ciudad');
    }
}

// publicar City
export const publishCity = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { id } = req.params;
        const { published } = req.body;
        console.log(`[PATCH] - publishCity para el ID: ${id} - ${new Date().toISOString()}`);

        const updatedCity = await Cities.findByIdAndUpdate(
            id,
            {
                published: published,
                publishDate: (published) ? new Date() : null
            },
            { new: true, runValidators: true }
        );
        if (!updatedCity) {
            console.log(`[PATCH] - publishCity - City Not Found`);
            return res.status(404).json({
                ok: false,
                message: 'No se encontró ciudad para publicar.'
            });
        }

        return res.status(200).json({
            ok: true,
            message: `Ciudad '${published ? 'publicada' : 'despublicada'}' correctamente.`,
            data: {
                city: updatedCity
            }
        });
    } catch (err) {
        console.error('[Error] - deleteCity:', err);
        return logError(res, err, 'Error interno del servidor al intentar publicar la ciudad');
    }
}

// add City Description
export const addCityDescription = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { cityId } = req.params;
        const { tale, author } = req.body;
        console.log(`[PUT] - addCityDescription para ${cityId} - ${new Date().toISOString()}`);

        const editedCity = await Cities.findByIdAndUpdate(
            cityId,
            {
                $push: {
                    description: [{
                        tale: tale,
                        author: author,
                        published: false,
                        writeDate: new Date()
                    }]
                }
            }, { new: true, runValidators: true }
        );
        if (!editedCity) {
            console.log(`[PUT] - addCityDescription - City Not Found`);
            return res.status(404).json({
                ok: false,
                message: 'No se encontró ciudad para añadir descripcion.'
            });
        }
        const newTale = editedCity.description.at(-1);
        return res.json({
            "ok": true,
            "data": { description: newTale }
        });
    } catch (err) {
        console.error('[Error] - addCityDescription:', err);
        return logError(res, err, 'Error interno del servidor al intentar agregar descripciones de la ciudad');
    }
}

// remove City Description
export const removeCityDescription = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { cityId, taleId } = req.params;
        console.log(`[DELETE] - removeCityDescription para ${cityId}, ${taleId} - ${new Date().toISOString()}`);

        const updatedCity = await Cities.findByIdAndUpdate(
            cityId,
            {
                $pull: {
                    description: { _id: taleId } // Busca dentro del array y remueve el objeto que coincida
                }
            },
            { new: true } // Nos devuelve la ciudad ya sin ese relato
        );


        if (!updatedCity) {
            console.log(`[DELETE] - removeCityDescription not found ${cityId}, ${taleId}`);
            return res.status(404).json({
                ok: false,
                message: 'No se encontró la ciudad especificada para eliminar el relato.'
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'El relato de descripción fue eliminado correctamente.',
            data: {
                city: updatedCity // El frontend recibe la ciudad limpia para actualizar su estado de Angular
            }
        });

    } catch (err) {
        console.error('[Error] - removeCityDescription:', err);
        return logError(res, err, 'Error interno del servidor al intentar eliminar las descripciones de la ciudad');
    }
}

// updates/publish City Description
export const updateCityDescription = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { cityId } = req.params;
        let { description } = req.body;
        console.log(`[PATCH] - updateCityDescription para ${cityId}, ${description?.id} - ${new Date().toISOString()}`);
        console.log('> descriptionId: ' + description.id);

        const updatedCity: CityInterface | null = await Cities.findByIdAndUpdate<CityInterface | null>(
            cityId,
            {
                $set: {
                    "description.$[elem].tale": description.tale,
                    "description.$[elem].published": description.published,
                    "description.$[elem].publishDate": description.published ? new Date() : null
                }
            },
            {
                arrayFilters: [{ "elem._id": description.id }],
                new: true, // 
                runValidators: true
            }
        );
        if (!updatedCity) {
            console.log(`[PATCH] - updateCityDescription - City Not Found`);
            return res.status(404).json({
                ok: false,
                message: 'No se encontró la ciudad especificada para editar el relato.'
            });
        }
        const updatedTale = updatedCity.description.find(d => d.id == description.id);
        if (!updatedTale) {
            console.log(`[PATCH] - updateCityDescription - Tale Not Found`);
            return res.status(444).json({
                ok: false,
                message: 'La ciudad existe, pero el relato específico no fue encontrado en el historial.'
            });
        }
        return res.status(200).json({
            ok: true,
            message: 'Relato actualizado correctamente.',
            data: {
                description: updatedTale
            }
        });
    } catch (err) {
        console.error('[Error] - updateCityDescription:', err);
        return logError(res, err, 'Error interno del servidor al intentar editar descripciones de la ciudad');
    }
}

// add City Travel
export const addCityTravel = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { cityId } = req.params; // /cities/:cityId/travel
        const { tale, author } = req.body;

        console.log(`[PUT] - addCityTravel para la ciudad ID: ${cityId} - ${new Date().toISOString()}`);

        // Insertamos en el array 'travel' y pedimos el documento actualizado
        const editedCity = await Cities.findByIdAndUpdate(
            cityId,
            {
                $push: {
                    travel: {
                        tale,
                        author,
                        published: false,
                        writeDate: new Date()
                    }
                }
            },
            { new: true, runValidators: true }
        );

        if (!editedCity) {
            console.log(`[PUT] - addCityTravel not found ${cityId}`);
            return res.status(404).json({
                ok: false,
                message: 'No se encontró la ciudad especificada para añadir el relato de viaje.'
            });
        }

        // Obtenemos el viaje recién empujado al final del array
        const newTravel = editedCity.travel.at(-1);
        return res.status(201).json({
            ok: true,
            message: 'Relato de viaje añadido correctamente a la ciudad.',
            data: {
                travel: newTravel
            }
        });

    } catch (err) {
        console.error('[Error] - addCityTravel:', err);
        return logError(res, err, 'Error interno del servidor al intentar añadir el viaje a la ciudad');
    }
};

// remove City Travel
export const removeCityTravel = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { cityId, taleId } = req.params;
        console.log(`[PATCH] - removeCityTravel para la ciudad ID: ${cityId} -> Viaje ID: ${taleId} - ${new Date().toISOString()}`);

        const updatedCity = await Cities.findByIdAndUpdate(
            cityId,
            {
                $pull: {
                    travel: { _id: taleId }
                }
            },
            { new: true }
        );

        if (!updatedCity) {
            console.log(`[PATCH] - removeCityTravel ciudad not found ID: ${cityId}`);
            return res.status(404).json({
                ok: false,
                message: 'No se encontró la ciudad especificada para remover el relato de viaje.'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'El relato de viaje fue eliminado correctamente.',
            data: {
                city: updatedCity
            }
        });

    } catch (err) {
        console.error('[Error] - removeCityTravel:', err);
        return logError(res, err, 'Error interno del servidor al intentar remover el viaje de la ciudad');
    }
};

// updates/publish City Travel
export const updateCityTravel = async (req: Request, res: Response): Promise<Response> => {
    try {
        const { cityId } = req.params;
        const { tale } = req.body;
        console.log(`[PATCH] - updateCityTravel para la ciudad: ${cityId} -> Viaje: ${tale?.id} - ${new Date().toISOString()}`);

        const updatedCity = await Cities.findByIdAndUpdate(
            cityId,
            {
                $set: {
                    "travel.$[elem].tale": tale.tale,
                    "travel.$[elem].published": tale.published,
                    "travel.$[elem].publishDate": tale.published ? new Date() : null
                }
            },
            {
                arrayFilters: [{ "elem._id": tale.id }],
                new: true,
                runValidators: true
            }
        );

        if (!updatedCity) {
            console.log(`[PATCH] - updateCityTravel  ciudad not found ${cityId}`);
            return res.status(404).json({
                ok: false,
                message: 'No se encontró la ciudad especificada para editar el viaje.'
            });
        }

        const updatedTravel = updatedCity.travel.find(t => t.id === tale.id);

        if (!updatedTravel) {
            console.log(`[PATCH] - updateCityTravel travel not found ${cityId}`);
            return res.status(444).json({
                ok: false,
                message: 'La ciudad existe, pero el relato de viaje específico no fue encontrado.'
            });
        }

        return res.status(200).json({
            ok: true,
            message: 'Viaje actualizado correctamente.',
            data: {
                travel: updatedTravel
            }
        });

    } catch (err) {
        console.error('[Error] - updateCityTravel:', err);
        return logError(res, err, 'Error interno del servidor al intentar editar los viajes de la ciudad');
    }
};
