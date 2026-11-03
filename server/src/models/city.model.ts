import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';
import { TaleSchema, type ITale } from './tale.model.js';
import { jsonOptions } from './json.js';

export interface IPlace {
  _id: Types.ObjectId;
  name: string;
  description: ITale[];
  entry: ITale[];
  /** IDs de los NPCs del lugar (se expone como `npcIds`) */
  events: Types.ObjectId[];
  published: boolean;
  publishDate?: Date | null;
  createdBy?: string;
}

export interface ICity {
  _id: Types.ObjectId;
  name: string;
  description: ITale[];
  travel: ITale[];
  places: IPlace[];
  published: boolean;
  publishDate?: Date | null;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

type PlaceOverrides = {
  description: Types.DocumentArray<ITale>;
  entry: Types.DocumentArray<ITale>;
};
type CityOverrides = {
  description: Types.DocumentArray<ITale>;
  travel: Types.DocumentArray<ITale>;
  places: Types.DocumentArray<IPlace & PlaceOverrides>;
};
type CityModel = Model<ICity, object, CityOverrides>;
export type CityDoc = HydratedDocument<ICity, CityOverrides>;
export type PlaceDoc = CityDoc['places'][number];

const PlaceSchema = new Schema<IPlace, Model<IPlace, object, PlaceOverrides>>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: [TaleSchema], default: [] },
    entry: { type: [TaleSchema], default: [] },
    events: [{ type: Schema.Types.ObjectId, ref: 'Npcs' }],
    published: { type: Boolean, default: false },
    publishDate: { type: Date, default: null },
    createdBy: String,
  },
  { toJSON: jsonOptions({ events: 'npcIds' }) },
);

const CitySchema = new Schema<ICity, CityModel>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    description: { type: [TaleSchema], default: [] },
    travel: { type: [TaleSchema], default: [] },
    places: { type: [PlaceSchema], default: [] },
    published: { type: Boolean, default: false },
    publishDate: { type: Date, default: null },
    createdBy: String,
  },
  { timestamps: true, toJSON: jsonOptions() },
);

CitySchema.index({ 'places._id': 1 });

export const City = model<ICity, CityModel>('City', CitySchema);
