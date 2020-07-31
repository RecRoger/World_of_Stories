"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const keys_1 = require("./keys");
const users_routes_1 = __importDefault(require("./routes/users.routes"));
const bodyParser = __importStar(require("body-parser"));
const cities_routes_1 = __importDefault(require("./routes/cities.routes"));
const places_routes_1 = __importDefault(require("./routes/places.routes"));
const chapters_routes_1 = __importDefault(require("./routes/chapters.routes"));
const cors_1 = __importDefault(require("cors"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swaggerDocument = __importStar(require("./swagger/swagger.json"));
const npcs_routes_1 = __importDefault(require("./routes/npcs.routes"));
const characters_routes_1 = __importDefault(require("./routes/characters.routes"));
const path_1 = __importDefault(require("path"));
const http = __importStar(require("http"));
class Server {
    constructor() {
        this.Start = (port) => {
            return new Promise((resolve, reject) => {
                this.express.listen(port, () => {
                    resolve(port);
                })
                    .on('error', (err) => reject(err));
            });
        };
        this.express = express_1.default();
        this.config();
        this.routes();
    }
    static bootstrap() {
        return new Server();
    }
    config() {
        // Parsers for POST data 
        this.express.use(bodyParser.json());
        this.express.use(bodyParser.urlencoded({ extended: false }));
        this.express.use(cors_1.default());
        // Point static path to public folder 
        this.express.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
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
    routes() {
        new users_routes_1.default(this.express);
        new characters_routes_1.default(this.express);
        new cities_routes_1.default(this.express);
        new places_routes_1.default(this.express);
        new npcs_routes_1.default(this.express);
        new chapters_routes_1.default(this.express);
        // swagger API
        this.express.use('/api', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
        // Catch all other routes and return the index file 
        this.express.get('*', (req, res) => {
            res.sendFile(path_1.default.join(__dirname, 'public/index.html'));
        });
    }
    setupDb() {
        const mongoDb = keys_1.mongoKeys.URI;
        mongoose_1.default.connect(mongoDb);
        const db = mongoose_1.default.connection;
        db.on("error", console.error.bind(console, "MongoDB Connection error"));
    }
}
Server.bootstrap();
exports.default = Server;
