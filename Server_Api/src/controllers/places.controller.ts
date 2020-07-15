import { Request, Response } from 'express';
import CitiesSchema, { CityInterface, PlaceInterface } from '../schemas/cities.model';

class PlacesController {

    // get all places of a city
    public async getCityPlaces(req: Request, res: Response) {
        try {
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            console.log('*************** getCityPlaces *******************');

            const { cityId, published } = req.body;
            const cities: CityInterface | null = await CitiesSchema.findOne(
                { _id: cityId },
                {
                    description: 0,
                    travel: 0,
                }
            );
            
            let places: PlaceInterface[] = (cities) ? cities.places : []

            console.log('_____________________________________________________');
            if (published) places = places.filter(place => place.published)
            res.json({
                "data": { "places": places }
            })
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }
    // get get complete place
    public async getOnePlace(req: Request, res: Response) {
        try {
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            console.log('*************** getOnePlace **************************');
            console.log('*************** ' + req.body.id + ' *******************');

            const city: CityInterface | null = await CitiesSchema.findOne(
                { "places._id": req.body.id },
                { places: 1 },
            );
            const places: PlaceInterface[] = (city) ? city.places : []
            const place = places.find(place => place._id == req.body.id);

            console.log('====================== ' + ((place) ? (<PlaceInterface>place).name : city) + ' =========================');
            console.log('_____________________________________________________');

            res.json({
                "data": { "place": (place) ? place : null }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }


    // save new place in city
    public async savePlace(req: Request, res: Response): Promise<void> {
        try {
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            console.log('*************** savePlace **************************');

            const { cityId, userName, name, description, entry } = req.body;

            console.log('*************** at: ' + cityId + '************************** ');

            const edition = await CitiesSchema.updateOne(
                { _id: cityId },
                {
                    $push: {
                        places: [{
                            name: name,
                            description: [{
                                tale: description,
                                author: userName,
                                published: false,
                                write_date: new Date()
                            }],		// descripcion del lugar, presentacion general
                            entry: [{
                                tale: entry,
                                author: userName,
                                published: false,
                                write_date: new Date()
                            }],	// cuento de entrada al lugar.
                            events: [],	//    los id's de los NPC's de ese lugar
                            publlished: false
                        }]
                    }
                }
            );

            const city: CityInterface | null = await CitiesSchema.findById(
                { _id: cityId },
                {
                    "places": 1
                }
            );

            const place = (city) ? city.places.slice(1)[0] : null;

            console.log('====================== ' + ((place) ? (<PlaceInterface>place).name : 'Not Found') + ' =========================');
            console.log('_____________________________________________________');

            res.json({
                "data": { "place": place }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }

    }
    // delete Place
    public async deletePlace(req: Request, res: Response): Promise<void> {
        try {
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            console.log('**************** deletePlace *******************');
            console.log('**************** ' + req.body.id + ' *******************');

            const edition = await CitiesSchema.updateOne(
                { "places._id": req.body.id },
                {
                    $pull: {
                        places: {
                            _id: req.body.id
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
            res.json({
                "error": err
            })
        }
    }


    // publicar Place
    public async publishPlace(req: Request, res: Response): Promise<void> {
        try {
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            console.log('**************** publishCity *******************');
            const { id, published } = req.body;
            console.log('**************** ' + id + ' *******************');
            console.log('**************** Publish Status: ' + published + ' *******************');

            const edition = await CitiesSchema.updateOne(
                { "places._id": id },
                {
                    $set: {
                        "places.$[elem].published": published,
                        "places.$[elem].publish_date": (published) ? new Date() : null
                    }
                },
                { arrayFilters: [{ "elem._id": id }] }
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


    // add Place Description
    public async addPlaceDescription(req: Request, res: Response): Promise<void> {
        try {
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            console.log('**************** addPlaceDescription *******************');

            const { placeId, tale, author } = req.body;
            console.log('**************** ' + placeId + ' *******************');

            const edition = await CitiesSchema.updateOne(
                { "places._id": placeId },
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

            const city: CityInterface | null = await CitiesSchema.findOne(
                { "places._id": placeId },
                {
                    "places.$[elem]": 1
                },
                { arrayFilters: [{ "elem._id": placeId }] }
            );

            const place: PlaceInterface | null = (city) ? city.places[0] : null;

            const newDescription = (place) ? place.description.slice(1)[0] : null;

            console.log('====================== ' + ((newDescription) ? 'OK' : 'Not Found') + ' =========================');
            console.log('_____________________________________________________');

            res.json({
                "data": newDescription
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }
    // remove Place Description
    public async removePlaceDescription(req: Request, res: Response): Promise<void> {
        try {
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            console.log('**************** removePlaceDescription *******************');

            const { descriptionId } = req.body;
            console.log('**************** ' + descriptionId + ' *******************');

            const edition = await CitiesSchema.updateOne(
                { "places.description._id": descriptionId },
                {
                    $pull: {
                        "places.$.description": {
                            _id: descriptionId
                        }
                    }
                }
            );
            console.log('===================== ' + ((edition.nModified) ? 'OK' : 'not Found') + ' ======================');
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
    // updates/publish Place Description
    public async updatePlaceDescription(req: Request, res: Response): Promise<void> {
        try {
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            console.log('**************** updatePlaceDescription *******************');
            let { description } = req.body;
            console.log('**************** ' + description._id + ' *******************');

            const edition = await CitiesSchema.updateOne(
                { "places.description._id": description._id },
                {
                    $set: {
                        "places.$.description.$[elem].tale": description.tale,
                        "places.$.description.$[elem].published": description.published,
                        "places.$.description.$[elem].publish_date": (description.published) ? new Date() : null
                    }
                },
                { arrayFilters: [{ "elem._id": description._id }] }
            );

            const city: CityInterface | null = await CitiesSchema.findOne(
                { "places.description._id": description._id },
                {
                    "places.$:": 1
                }
            );

            const place = (city) ? (city as CityInterface).places[0] : null;
            let updatedDescription;

            updatedDescription = (place) ? (place as PlaceInterface).description : null;

            console.log('====================== ' + ((edition.nModified && updatedDescription) ? 'OK' : 'Not Found') + ' =========================');
            console.log('_____________________________________________________');

            res.json({
                "data": updatedDescription
            });
        } catch (err) {
            res.json({
                "error": err
            })
        }
    }


    // add Place Entry
    public async addPlaceEntry(req: Request, res: Response): Promise<void> {
        try {
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            console.log('**************** addPlaceEntry *******************');

            const { placeId, tale, author } = req.body;
            console.log('**************** ' + placeId + ' *******************');

            const edition = await CitiesSchema.updateOne(
                { "places._id": placeId },
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

            const city: CityInterface | null = await CitiesSchema.findOne(
                { "places._id": placeId },
                {
                    "places.$[elem]": 1
                },
                { arrayFilters: [{ "elem._id": placeId }] }
            );

            const place: PlaceInterface | null = (city) ? city.places[0] : null;

            const newEntry = (place) ? place.entry.slice(1)[0] : null;

            console.log('====================== ' + ((edition.nModified && newEntry) ? 'OK' : 'Not Found') + ' =========================');
            console.log('_____________________________________________________');

            res.json({
                "data": newEntry
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }

    }
    // remove Place Entry
    public async removePlaceEntry(req: Request, res: Response): Promise<void> {
        try {
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            console.log('**************** removePlaceEntry *******************');

            const { entryId } = req.body;
            console.log('**************** ' + entryId + ' *******************');

            const edition = await CitiesSchema.updateOne(
                { "places.entry._id": entryId },
                {
                    $pull: {
                        "places.$.entry": {
                            _id: entryId
                        }
                    }
                }
            );
            console.log('===================== ' + ((edition.nModified) ? 'OK' : 'not Found') + ' ======================');
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
    // updates/publish Place Description
    public async updatePlaceEntry(req: Request, res: Response): Promise<void> {

        try {
            console.log('^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^');
            console.log('**************** updatePlaceEntry *******************');
            const { entry } = req.body;
            console.log('**************** ' + entry._id + ' *******************');

            const edition = await CitiesSchema.updateOne(
                { "places.entry._id": entry._id },
                {
                    $set: {
                        "places.$.entry.$[elem].tale": entry.tale,
                        "places.$.entry.$[elem].published": entry.published,
                        "places.$.entry.$[elem].publish_date": (entry.published) ? new Date() : null
                    }
                },
                { arrayFilters: [{ "elem._id": entry._id }] }
            );

            const city: CityInterface | null = await CitiesSchema.findOne(
                { "places.entry._id": entry._id },
                {
                    "places.$:": 1
                }
            );

            const place = (city) ? (city as CityInterface).places[0] : null;
            let updateEntry;

            updateEntry = (place) ? (place as PlaceInterface).entry : null;

            console.log('====================== ' + ((edition.nModified && updateEntry) ? 'OK' : 'Not Found') + ' =========================');
            console.log('_____________________________________________________');

            res.json({
                "data": updateEntry
            });
        } catch (err) {
            res.json({
                "error": err
            })
        }

    }

}


export const placesController = new PlacesController();
