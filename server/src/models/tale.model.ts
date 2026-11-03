import { Schema, type Types } from 'mongoose';
import type { Readable } from '@wos/shared';
import { jsonOptions } from './json.js';

export interface ITale {
  _id: Types.ObjectId;
  tale: Readable[];
  /** username del autor */
  author: string;
  published: boolean;
  writeDate?: Date;
  publishDate?: Date | null;
}

export const ReadableSchema = new Schema<Readable>(
  {
    text: { type: String, required: true },
    // sin enum en BD para no romper datos antiguos; la API valida los valores nuevos
    animation: String,
  },
  { _id: false },
);

export const TaleSchema = new Schema<ITale>(
  {
    tale: { type: [ReadableSchema], default: [] },
    author: { type: String, default: '' },
    published: { type: Boolean, default: false },
    writeDate: { type: Date, default: Date.now },
    publishDate: { type: Date, default: null },
  },
  { toJSON: jsonOptions() },
);
