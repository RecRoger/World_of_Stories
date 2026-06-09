import { Document, Schema, model } from 'mongoose';
import { TaleInterface, TaleSchema } from './tale.model.js';

export interface PlaceInterface extends Document {
    name: string;		            // nombre del lugar
    description: TaleInterface[];		// descripcion del lugar, presentacion general
    entry: TaleInterface[];	        // cuento de entrada al lugar.
    events: Schema.Types.ObjectId[];	            // los id's de los NPC's de ese lugar
    published: boolean
    publishDate: Date
}

export interface CityInterface extends Document {
    name: string,
    description: TaleInterface[],
    travel: TaleInterface[],
    places: PlaceInterface[],
    published: boolean,
    publishDate: Date
}

const PlacesSchema = new Schema({
    name: String,
    description: [TaleSchema],
    entry: [TaleSchema],
    events: [{ type: Schema.Types.ObjectId, ref: 'Npc' }],
    published: Boolean,
    publishDate: Date
})

const CitiesSchema = new Schema({
    name: { type: String, required: true, unique: true, trim: true },   // nombre de la ciudad
    description: { type: [TaleSchema], default: [] },   // descripciones de la ciudad
    travel: { type: [TaleSchema], default: [] },   // narraciones de diferentes viajes hacia la ciudad
    places: [PlacesSchema], // ide de los lugares (Places) de esa ciudad
    published: Boolean,
    publishDate: Date
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

export default model<CityInterface>('City', CitiesSchema);
