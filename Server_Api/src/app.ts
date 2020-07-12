import express from 'express';
import mongoose from "mongoose";
import { mongoKeys } from './keys';
import UserRouter from './routes/users.routes';
import * as bodyParser from 'body-parser';
import CitiesRouter from './routes/cities.routes';
import PlacesRouter from './routes/places.routes';
import ChaptersRouter from './routes/chapters.routes';

import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json'

class App {
    private express: any

    constructor() {
        this.express = express();
        this.setupDb();

        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(bodyParser.json());

        new UserRouter(this.express);
        new CitiesRouter(this.express);
        new PlacesRouter(this.express);
        new PlacesRouter(this.express);
        new ChaptersRouter(this.express);

    }
    
    public Start = (port: number) => {
        return new Promise((resolve, reject) => {
            
            this.express.listen(port,
                () => {
                    this.express.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
                    resolve(port)
                })
                .on('error', (err: object) => reject(err));
        })
    }

    
    private setupDb(): void {
        var mongoDb = mongoKeys.URI;
        mongoose.connect(mongoDb);
        var db = mongoose.connection;
        db.on("error", console.error.bind(console, "MongoDB Connection error"));
      }
}

export default App;