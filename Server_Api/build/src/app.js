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
class App {
    constructor() {
        this.Start = (port) => {
            return new Promise((resolve, reject) => {
                this.express.listen(port, () => {
                    this.express.use('/api', swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swaggerDocument));
                    resolve(port);
                })
                    .on('error', (err) => reject(err));
            });
        };
        this.express = express_1.default();
        this.setupDb();
        this.express.use(bodyParser.urlencoded({ extended: true }));
        this.express.use(bodyParser.json());
        this.express.use(cors_1.default());
        new users_routes_1.default(this.express);
        new cities_routes_1.default(this.express);
        new places_routes_1.default(this.express);
        new places_routes_1.default(this.express);
        new npcs_routes_1.default(this.express);
        new chapters_routes_1.default(this.express);
    }
    setupDb() {
        var mongoDb = keys_1.mongoKeys.URI;
        mongoose_1.default.connect(mongoDb);
        var db = mongoose_1.default.connection;
        db.on("error", console.error.bind(console, "MongoDB Connection error"));
    }
}
exports.default = App;
