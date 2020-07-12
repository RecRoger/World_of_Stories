import mongoose, { Schema, model } from 'mongoose';
import { publicTale } from './common.model';

export interface CityInterface extends mongoose.Document {
    _id: string
    name: string,              // nombre de la ciudad
    description: publicTale[], // descripciones de la ciudad
    travel: publicTale[],      // narraciones de diferentes viajes hacia la ciudad
    places: PlaceInterface[],  // ide de los lugares (Places) de esa ciudad
    published: boolean,
    publish_date: Date
}

export interface PlaceInterface {
    _id: string
    name: string;		            // nombre del lugar
    description: publicTale[];		// descripcion del lugar, presentacion general
    entry: publicTale[];	        // cuento de entrada al lugar.
    events: string[];	            // los id's de los NPC's de ese lugar
    published: boolean
    publish_date: Date
}


const CitiesSchema = new Schema({
    name: String,
    description: [{
        tale: [{
            text: String,
            animation: String
        }],
        author: String,
        published: Boolean,
        write_date: Date,
        publish_date: Date,
    }],
    travel: [{
        tale: [{
            text: String,
            animation: String
        }],
        author: String,
        published: Boolean,
        write_date: Date,
        publish_date: Date,
    }],
    places: [{
        name: String,
        description: [{
            tale: [{
                text: String,
                animation: String
            }],
            author: String,
            published: Boolean,
            write_date: Date,
            publish_date: Date,
        }],
        entry: [{
            tale: [{
                text: String,
                animation: String
            }],
            author: String,
            published: Boolean,
            write_date: Date,
            publish_date: Date,
        }],
        events: [String],
        published: Boolean,
        publish_date: Date
    }],
    published: Boolean,
    publish_date: Date
})

export default model<CityInterface>('city', CitiesSchema);
