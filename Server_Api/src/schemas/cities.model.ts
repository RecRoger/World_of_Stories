import mongoose, { Schema, model } from 'mongoose';
import { publicTale } from './common.model';

export interface CityInterface extends mongoose.Document {
    _id: string
    name: string,
    description: publicTale[],
    travel: publicTale[],
    places: PlaceInterface[],
    published: boolean,
    publishDate: Date
}

export interface PlaceInterface {
    _id: string
    name: string;		            // nombre del lugar
    description: publicTale[];		// descripcion del lugar, presentacion general
    entry: publicTale[];	        // cuento de entrada al lugar.
    events: string[];	            // los id's de los NPC's de ese lugar
    published: boolean
    publishDate: Date
}


const CitiesSchema = new Schema({
    name: String,   // nombre de la ciudad
    description: [{
        tale: [{
            text: String,
            animation: String
        }],
        author: String,
        published: Boolean,
        writeDate: Date,
        publishDate: Date,
    }],   // descripciones de la ciudad
    travel: [{
        tale: [{
            text: String,
            animation: String
        }],
        author: String,
        published: Boolean,
        writeDate: Date,
        publishDate: Date,
    }],   // narraciones de diferentes viajes hacia la ciudad
    places: [{
        name: String,
        description: [{
            tale: [{
                text: String,
                animation: String
            }],
            author: String,
            published: Boolean,
            writeDate: Date,
            publishDate: Date,
        }],
        entry: [{
            tale: [{
                text: String,
                animation: String
            }],
            author: String,
            published: Boolean,
            writeDate: Date,
            publishDate: Date,
        }],
        events: [String],
        published: Boolean,
        publishDate: Date
    }], // ide de los lugares (Places) de esa ciudad
    published: Boolean,
    publishDate: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

export default model<CityInterface>('city', CitiesSchema);
