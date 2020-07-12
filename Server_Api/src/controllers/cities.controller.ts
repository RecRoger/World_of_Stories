import { Request, Response } from 'express';
import CitiesSchema, { CityInterface } from '../schemas/cities.model';

class CitiesController {

    // get all cities without places
    public async getAllCities(req: Request, res: Response) {
        try {
            const { published } = req.body;
            const filter = (published)?{published:true}:{};
            const cities: CityInterface[] = await CitiesSchema.find(filter, {
                places: 0
            });
            res.json({
                "data": { "cities": cities }
            })
        } catch (err) {
            res.json({
                "error": err
            })
        }
    }
    // get get complete city
    public async getOneCity(req: Request, res: Response) {
        try {
            const city: CityInterface | null = await CitiesSchema.findById(
                { _id: req.body.id },
                {
                    "places.description": 0,
                    "places.entry": 0,
                    "places.events": 0
                }
            );
            res.json({
                "data": { "city" : city }
            });
        } catch (err) {
            res.json({
                "error": err
            })
        }
    }


    // save new City
    public async saveCity(req: Request, res: Response): Promise<void> {
        try {
            const { userid, name, description, travel } = req.body;
    
            const city: CityInterface = new CitiesSchema({
                name: name,   // nombre de la ciudad
                description: [{
                    tale: description,
                    author: userid,
                    write_date: new Date(),
                    published: false
                }], // descripciones de la ciudad
                travel: [{
                    tale: travel,
                    author: userid,
                    write_date: new Date(),
                    published: false
                }], // narraciones de diferentes viajes hacia la ciudad
                places: [],  // ide de los lugares (Places) de esa ciudad
                published: false
            });
            await city.save();
            res.json({
                "data": { "city" : city }
            });
        } catch (err) {
            res.json({
                "error":err
            })
        }

    }
    // delete City
    public async deleteCity(req: Request, res: Response): Promise<void> {
        try {
            const city = await CitiesSchema.deleteOne({
                _id: req.body.id
            });
            res.json({
                "data": city
            });
        } catch (err) {
            res.json({
                "error":err
            })
        }
    }
    // publicar City
    public async publishCity(req: Request, res: Response): Promise<void> {
        try {
            const { id, published } = req.body;
            const city = await CitiesSchema.updateOne(
                { _id: id },
                {
                    published: published,
                    publish_date: (published) ? new Date() : null
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


    // add City Description
    public async addCityDescription(req: Request, res: Response): Promise<void> {
        try {
            const { id, tale, author } = req.body;
            const city = await CitiesSchema.updateOne(
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
                "error":err
            })
        }
    }
    // remove City Description
    public async removeCityDescription(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;
            const city = await CitiesSchema.updateOne(
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
                "error":err
            })
        }
    }

    // updates/publish City Description
    public async updateCityDescription(req: Request, res: Response): Promise<void> {
        try {
            const { description } = req.body;
            const city = await CitiesSchema.updateOne(
                { "description._id": description.id },
                {
                    $set: {
                        "description.$[elem].tale": description.tale,
                        "description.$[elem].published": description.published,
                        "description.$[elem].publish_date": (description.published) ? new Date() : null
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

    // add City Travel
    public async addCityTravel(req: Request, res: Response): Promise<void> {
        try {
            const { id, tale, author } = req.body;
            const city = await CitiesSchema.updateOne(
                { _id: id },
                {
                    $push: {
                        travel: [{
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
    // remove City Travel
    public async removeCityTravel(req: Request, res: Response): Promise<void> {
        try {
            const { id } = req.body;
            const city = await CitiesSchema.updateOne(
                { "travel._id": id },
                {
                    $pull: {
                        travel: {
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
    // updates/publish City Travel
    public async updateCityTravel(req: Request, res: Response): Promise<void> {
        try {
            const { travel } = req.body;
            const city = await CitiesSchema.updateOne(
                { "travel._id": travel.id },
                {
                    $set: {
                        "travel.$[elem].tale": travel.tale,
                        "travel.$[elem].published": travel.published,
                        "travel.$[elem].publish_date": (travel.published) ? new Date() : null
                    }
                },
                { arrayFilters: [{ "elem._id": travel.id }] }
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


export const citiesController = new CitiesController();
