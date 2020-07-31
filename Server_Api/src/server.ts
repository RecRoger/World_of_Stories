import express from 'express';
import mongoose from "mongoose";
import { mongoKeys } from './keys';
import UserRouter from './routes/users.routes';
import * as bodyParser from 'body-parser';
import CitiesRouter from './routes/cities.routes';
import PlacesRouter from './routes/places.routes';
import ChaptersRouter from './routes/chapters.routes';
import cors from 'cors';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger/swagger.json'
import NpcsRouter from './routes/npcs.routes';
import CharactersRouter from './routes/characters.routes';
import path from 'path';
import * as http from 'http';


class Server {
    private express: express.Application

    public static bootstrap(): Server {
        return new Server();
    }

    constructor() {
        this.express = express();

        this.config();

        this.routes();

    }

    private config() {

        // Parsers for POST data 
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cors());

        // Point static path to public folder 
        this.express.use(express.static(path.join(__dirname, 'public')));

        /** 
         * Get port from environment and store in Express. 
         */
        const port = process.env.PORT || '3000';
        this.express.set('port', port);

        /** 
         * Start Db configurations. 
         */
        this.setupDb();

        /** 
         * Create HTTP server. 
         */
        const server = http.createServer(this.express);

        /** 
         * Listen on provided port, on all network interfaces. 
         */
        server.listen(port, () => {
            console.log(`******* Aplication Start *********`);
            console.log(`Server listening on port ${port}`);
            console.log(`**********************************`);
        });

    }

    private routes() {

        new UserRouter(this.express);

        new CharactersRouter(this.express);


        new CitiesRouter(this.express);

        new PlacesRouter(this.express);


        new NpcsRouter(this.express);

        new ChaptersRouter(this.express);


        // swagger API
        this.express.use('/api', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


        // Catch all other routes and return the index file 
        this.express.get('*', (req, res) => {
            res.sendFile(path.join(__dirname, 'public/index.html'));
        });

    }
    

    public Start = (port: number) => {
        return new Promise((resolve, reject) => {

            this.express.listen(port,
                () => {
                    resolve(port)
                })
                .on('error', (err: object) => reject(err));
        })
    }


    private setupDb(): void {
        const mongoDb = mongoKeys.URI;
        mongoose.connect(mongoDb);
        const db = mongoose.connection;
        db.on("error", console.error.bind(console, "MongoDB Connection error"));
    }
}

Server.bootstrap();

export default Server;