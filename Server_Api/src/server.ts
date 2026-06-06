import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import mongoose from 'mongoose';
import swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './docs/swagger.js'
import { mainRouter } from './routes/index.js'; // Tu enrutador central

class Server {
    private app: Application;
    private port: string | number;
    private mongoUri: string;

    constructor() {
        this.app = express();
        this.port = process.env.PORT || 3000;
        this.mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/world_of_stories';

        this.connectDatabase();
        this.setMiddlewares();
        this.setRoutes();
    }

    private async connectDatabase(): Promise<void> {
        try {
            // Conexión limpia sin flags obsoletos
            await mongoose.connect(this.mongoUri);
            console.log('--- Conexión exitosa a MongoDB ---');
        } catch (error) {
            console.error('Error al conectar a la base de datos:', error);
            process.exit(1); // Detiene la app si no hay base de datos
        }
    }

    private setMiddlewares(): void {
        this.app.use(helmet());

        // Configuración de CORS centralizada
        this.app.use(cors({
            origin: 'http://localhost:4200', // El puerto donde corre tu Angular en desarrollo
            methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
            allowedHeaders: ['Content-Type', 'Authorization'],
            credentials: true // Vital si vas a manejar cookies o sesiones con Passport más adelante
        }));

        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));

        this.app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
    }

    private setRoutes(): void {
        // Prefijo global para la API clean
        this.app.use('/api/v1', mainRouter);
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Servidor corriendo en el puerto: ${this.port}`);
        });
    }
}

// Inicialización del servidor
const server = new Server();
server.listen();