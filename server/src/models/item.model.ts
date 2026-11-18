import { Schema, model, type HydratedDocument, type Types } from 'mongoose';
import { jsonOptions } from './json.js';

/** Objeto del catálogo: nombre, descripción opcional y precio; su autor (o un admin) es quien lo edita o borra */
export interface IItem {
  _id: Types.ObjectId;
  name: string;
  /** Opcional: '' si no tiene */
  description: string;
  price: number;
  /** Elemento común: se puede tener varias veces. Si no, es un objeto único */
  stackable: boolean;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}
export type ItemDoc = HydratedDocument<IItem>;

/** Compara nombres sin distinguir mayúsculas ni acentos («Farol» = «farol») */
export const ITEM_NAME_COLLATION = { locale: 'es', strength: 1 } as const;

const ItemSchema = new Schema<IItem>(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, default: '', trim: true },
    price: { type: Number, required: true, min: 0 },
    stackable: { type: Boolean, default: false },
    author: { type: String, required: true },
  },
  { timestamps: true, toJSON: jsonOptions() },
);

ItemSchema.index({ name: 1 }, { unique: true, collation: ITEM_NAME_COLLATION });

export const Item = model<IItem>('Items', ItemSchema);
