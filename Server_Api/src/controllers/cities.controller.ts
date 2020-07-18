import { Request, Response } from 'express';
import CitiesSchema, { CityInterface } from '../schemas/cities.model';

class CitiesController {

    // get all cities without places
    public async getAllCities(req: Request, res: Response) {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('*************** getAllCities *******************');

            const { published } = req.body;
            const filter = (published) ? { published: true } : {};
            const cities: CityInterface[] = await CitiesSchema.find(filter, {
                places: 0
            }).lean();

            const castCities = cities.map(city => {
                city.id = city._id;
                city.description = city.description.map(t => ({ ...t, id: t._id }))
                city.travel = city.travel.map(t => ({ ...t, id: t._id }))
                return city
            })
            console.log('_____________________________________________________');
            res.json({
                "data": { "cities": castCities }
            })

        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }
    // get get complete city
    public async getOneCity(req: Request, res: Response) {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('*************** getCity **************************');
            console.log('> cityId: ' + req.body.id);

            const city: CityInterface | null = await CitiesSchema.findById(
                { _id: req.body.id },
                {
                    "places.description": 0,
                    "places.entry": 0,
                    "places.events": 0
                }
            ).lean();

            const castCity = city ? {
                ...city,
                id: city._id,
                description: city.description.map(t => ({ ...t, id: t._id })),
                travel: city.travel.map(t => ({ ...t, id: t._id })),
                places: city.places.map(t => ({ ...t, id: t._id })),
            } : null;

            console.log('> response:' + ((city) ? (<CityInterface>city).name : city));
            console.log('_____________________________________________________');
            res.json({
                "data": { "city": castCity }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }


    // save new City
    public async saveCity(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('*************** newCity **************************');

            const { userName, name, description, travel } = req.body;

            const newCity: CityInterface = new CitiesSchema({
                name: name,   // nombre de la ciudad
                description: [{
                    tale: description,
                    author: userName,
                    writeDate: new Date(),
                    published: false
                }], // descripciones de la ciudad
                travel: [{
                    tale: travel,
                    author: userName,
                    writeDate: new Date(),
                    published: false
                }], // narraciones de diferentes viajes hacia la ciudad
                places: [],  // ide de los lugares (Places) de esa ciudad
                published: false
            });
            await newCity.save();

            const city: CityInterface | null = await CitiesSchema.findOne({ _id: newCity._id }).lean();

            const castCity = city ? {
                ...city,
                id: city._id,
                description: city.description.map(t => ({ ...t, id: t._id })),
                travel: city.travel.map(t => ({ ...t, id: t._id })),
            } : null;

            console.log('> response: ' + ((city) ? (<CityInterface>city).name : city));
            console.log('_____________________________________________________');
            res.json({
                "data": { "city": castCity }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }

    }

    // delete City
    public async deleteCity(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('**************** deleteCity *******************');
            console.log('> cityId: ' + req.body.id);

            const edition = await CitiesSchema.deleteOne({
                _id: req.body.id
            });

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
    // publicar City
    public async publishCity(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('**************** publishCity *******************');
            const { id, published } = req.body;
            console.log('> cityId: ' + id);
            console.log('> Publish Status: ' + published);
            const edition = await CitiesSchema.updateOne(
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


    // add City Description
    public async addCityDescription(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('**************** addCityDescription *******************');
            const { cityId, tale, author } = req.body.description;
            console.log('> cityId ' + cityId);

            const edition = await CitiesSchema.updateOne(
                { _id: cityId },
                {
                    $push: {
                        description: [{
                            tale: tale,
                            author: author,
                            published: false,
                            writeDate: new Date()
                        }]
                    }
                }
            );

            const city: CityInterface | null = await CitiesSchema.findById(
                { _id: cityId },
                {
                    "description": 1
                }
            ).lean();
            const descriptions = (city) ? (<CityInterface>city).description : null;

            const description = (descriptions) ? descriptions.slice(-1)[0] : null;

            console.log('> response: ' + ((description) ? 'OK' : 'Not Found'));
            console.log('_____________________________________________________');
            res.json({
                "data": description && { ...description, id: description._id }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }
    // remove City Description
    public async removeCityDescription(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('**************** removeCityDescription *******************');

            const { descriptionId } = req.body;
            console.log('> descriptionId ' + descriptionId);

            const edition = await CitiesSchema.updateOne(
                { "description._id": descriptionId },
                {
                    $pull: {
                        description: {
                            _id: descriptionId
                        }
                    }
                }
            );
            console.log('> response: ' + ((edition.nModified) ? 'OK' : 'not Found'));
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
    // updates/publish City Description
    public async updateCityDescription(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('**************** updateCityDescription *******************');
            let { description } = req.body;
            console.log('> descriptionId: ' + description.id);

            const edition = await CitiesSchema.updateOne(
                { "description._id": description.id },
                {
                    $set: {
                        "description.$[elem].tale": description.tale,
                        "description.$[elem].published": description.published,
                        "description.$[elem].publishDate": (description.published) ? new Date() : null
                    }
                },
                { arrayFilters: [{ "elem._id": description.id }] }
            );

            const city: CityInterface | null = await CitiesSchema.findOne(
                { "description._id": description.id },
                {
                    "description.$[elem]": 1
                },
                { arrayFilters: [{ "elem._id": description.id }] }
            ).lean();

            const updatedDescription = (city) ? (city as CityInterface).description[0] : null;

            console.log('> response:' + ((updatedDescription) ? 'OK' : 'Not Found'));
            console.log('_____________________________________________________');

            res.json({
                "data": updatedDescription && { ...updatedDescription, id: updatedDescription._id }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }


    // add City Travel
    public async addCityTravel(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('**************** addCityTravel *******************');
            const { cityId, tale, author } = req.body.travel;
            console.log('> cityId ' + cityId);

            const edition = await CitiesSchema.updateOne(
                { _id: cityId },
                {
                    $push: {
                        travel: [{
                            tale: tale,
                            author: author,
                            published: false,
                            writeDate: new Date()
                        }]
                    }
                }
            );

            const city: CityInterface | null = await CitiesSchema.findById(
                { _id: cityId },
                {
                    "travel": 1
                }
            ).lean();


            const travels = (city) ? (<CityInterface>city).travel : null;
            const travel = (travels) ? travels.slice(-1)[0] : null;

            console.log('> response: ' + ((travel) ? 'OK' : 'Not Found'));
            console.log('_____________________________________________________');
            res.json({
                "data": travel && { ...travel, id: travel._id }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }

    }
    // remove City Travel
    public async removeCityTravel(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('**************** removeCityTravel *******************');
            const { travelId } = req.body;

            console.log('> travelId: ' + travelId);

            const edition = await CitiesSchema.updateOne(
                { "travel._id": travelId },
                {
                    $pull: {
                        travel: {
                            _id: travelId
                        }
                    }
                }
            );
            console.log('> response: ' + ((edition.nModified) ? 'OK' : 'not Found'));
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
    // updates/publish City Travel
    public async updateCityTravel(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('**************** updateCityTravel *******************');
            const { travel } = req.body;

            const id = travel.id;
            console.log('> travelId: ' + travel.id);

            const edition = await CitiesSchema.updateOne(
                { "travel._id": travel.id },
                {
                    $set: {
                        "travel.$[elem].tale": travel.tale,
                        "travel.$[elem].published": travel.published,
                        "travel.$[elem].publishDate": (travel.published) ? new Date() : null
                    }
                },
                { arrayFilters: [{ "elem._id": travel.id }] }
            );

            const city: CityInterface | null = await CitiesSchema.findOne(
                { "travel._id": travel.id },
                {
                    "travel.$[elem]": 1
                },
                { arrayFilters: [{ "elem._id": travel.id }] }
            ).lean();

            const updatedTravel = (city) ? (city as CityInterface).travel[0] : null;

            console.log('> response: ' + ((updatedTravel) ? 'OK' : 'Not Found'));
            console.log('_____________________________________________________');

            res.json({
                "data": updatedTravel && { ...updatedTravel, id: updatedTravel._id }
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


export const citiesController = new CitiesController();
