import { Document, Schema } from 'mongoose';


export interface ReadableInterface {
  text: string;
  animation?: string;
}

export interface TaleInterface extends Document {
  tale: ReadableInterface[];        // Narrativa
  author: Schema.Types.ObjectId;       // nombre del autor
  published: boolean;   // Estado de publicacion
  writeDate: Date;     // Fecha de creacion
  publishDate: Date;   // Fecha de publicacion
}


// Subesquema de Ubicación (Location)
export const ReadableSchema = new Schema<ReadableInterface>({
  text: { type: String, required: true },
  animation: String,
}, { _id: false });

// Subesquema de Ubicación (Location)
export const TaleSchema = new Schema<TaleInterface>({
  tale: { type: [ReadableSchema], required: true },        // Narrativa
  author: { type: Schema.Types.ObjectId, ref: 'User', required: true },       // nombre del autor
  published: Boolean,   // Estado de publicacion
  writeDate: Date,     // Fecha de creacion
  publishDate: Date,   // Fecha de publicacion
});