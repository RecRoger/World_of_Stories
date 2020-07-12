import { Request, Response } from 'express';
import CitiesSchema, { CityInterface, PlaceInterface } from '../schemas/cities.model';

class PlacesController {

    // get all places of a city
    public async getCityPlaces(req: Request, res: Response) {
        try {
            const { id, published } = req.body;
            const cities: CityInterface | null = await CitiesSchema.findOne(
                { _id: id },
                {
                    description: 0,
                    travel: 0,
                    // "places.entry": 0
                }
            );

            let places: PlaceInterface[] = (cities) ? cities.places : []

            if (published) places = places.filter(place => place.published)
            res.json({
                "data": { "places" : places }
            })
        } catch (err) {
            res.json({
                "error": err
            })
        }
    }
    // get get complete place
    public async getOnePlace(req: Request, res: Response) {
        try {

            const city: CityInterface | null = await CitiesSchema.findOne(
                { "places._id": req.body.id },
                { places: 1 },
            );
            const places: PlaceInterface[] = (city) ? city.places : []
            const place = places.find(place => place._id == req.body.id);
            res.json({
                "data": { "place" : (place) ? place : null }
            });
        } catch (err) {
            res.json({
                "error": err
            })
        }
    }


    // save new place in city
    public async savePlace(req: Request, res: Response): Promise<void> {
        try {
            const { id, userid, name, description, entry } = req.body;
            const city = await CitiesSchema.updateOne(
                { _id: id },
                {
                    $push: {
                        places: [{
                            name: name,
                            description: [{
                                tale: description,
                                author: userid,
                                published: false,
                                write_date: new Date()
                            }],		// descripcion del lugar, presentacion general
                            entry: [{
                                tale: entry,
                                author: userid,
                                published: false,
                                write_date: new Date()
                            }],	// cuento de entrada al lugar.
                            events: [],	//    los id's de los NPC's de ese lugar
                            publlished: false
                        }]
                    }
                }
            );
            res.json({
                "data": city
            });
        } catch (err) {
            res.json({
                "error":err
            })
        }
        
    }
    // delete Place
    public async deletePlace(req: Request, res: Response): Promise<void> {
        try {
            const city = await CitiesSchema.updateOne(
                { "places._id": req.body.id },
                {
                    $pull: {
                        places: {
                            _id: req.body.id
                        }
                    }
                }
            );
            res.json({
                "data": city
            });
        } catch (err) {
            res.json({
                "error":err
            })
        }
    }
    // publicar Place
    public async publishPlace(req: Request, res: Response): Promise<void> {
        try {
            const { id, published } = req.body;
            const city = await CitiesSchema.updateOne(
                { "places._id": id },
                {
                    $set: {
                        "places.$[elem].published": published,
                        "places.$[elem].publish_date": (published) ? new Date() : null
                    }
                },
                { arrayFilters: [{ "elem._id": id }] }
            );
            res.json({
                "data": city
            });
        } catch (err) {
            res.json({
                "error":err
            })
        }
    }


    // add Place Description
    public async addPlaceDescription(req: Request, res: Response): Promise<void> {
        try {
            const { id, tale, author } = req.body;
            const city = await CitiesSchema.updateOne(
                { "places._id": id },
                {
                    $push: {
                        "places.$.description": [{
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
                "error":err
            })
        }
    }
    // remove Place Description
    public async removePlaceDescription(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;
            const city = await CitiesSchema.updateOne(
                { "places.description._id": id },
                {
                    $pull: {
                        "places.$.description": {
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
                "error":err
            })
        }
    }
    // updates/publish Place Description
    public async updatePlaceDescription(req: Request, res: Response): Promise<void> {
        try {
            const { description } = req.body;
            const city = await CitiesSchema.updateOne(
                { "places.description._id": description.id },
                {
                    $set: {
                        "places.$.description.$[elem].tale": description.tale,
                        "places.$.description.$[elem].published": description.published,
                        "places.$.description.$[elem].publish_date": (description.published) ? new Date() : null
                    }
                },
                { arrayFilters: [{ "elem._id": description.id }] }
            );
            res.json({
                "data": city
            });
        } catch (err) {
            res.json({
                "error":err
            })
        }
    }


    // add Place Entry
    public async addPlaceEntry(req: Request, res: Response): Promise<void> {
        try {
            const { id, tale, author } = req.body;
            const city = await CitiesSchema.updateOne(
                { "places._id": id },
                {
                    $push: {
                        "places.$.entry": [{
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
                "error":err
            })
        }
    }
    // remove Place Entry
    public async removePlaceEntry(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;
            const city = await CitiesSchema.updateOne(
                { "places.entry._id": id },
                {
                    $pull: {
                        "places.$.entry": {
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
                "error":err
            })
        }
    }
    // updates/publish Place Description
    public async updatePlaceEntry(req: Request, res: Response): Promise<void> {
        try {
            const { entry } = req.body;
            const city = await CitiesSchema.updateOne(
                { "places.entry._id": entry.id },
                {
                    $set: {
                        "places.$.entry.$[elem].tale": entry.tale,
                        "places.$.entry.$[elem].published": entry.published,
                        "places.$.entry.$[elem].publish_date": (entry.published) ? new Date() : null
                    }
                },
                { arrayFilters: [{ "elem._id": entry.id }] }
            );
            res.json({
                "data": city
            });
        } catch (err) {
            res.json({
                "error":err
            })
        }
    }

}


export const placesController = new PlacesController();
