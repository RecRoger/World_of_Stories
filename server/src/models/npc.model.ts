import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';
import type { EndLocation, Readable } from '@wos/shared';
import { ReadableSchema, TaleSchema, type ITale } from './tale.model.js';
import { jsonOptions } from './json.js';

export interface IOption {
  _id: Types.ObjectId;
  name: string;
  description: string;
  /** ID del capítulo destino */
  value: string;
  published: boolean;
  removeItem: boolean;
}

export interface IDecision {
  decisionType: 'choose' | 'item' | 'money';
  amount?: number;
  item?: string;
  options: IOption[];
}

/** Decisión en forma plana, para asignarla con `doc.set()` */
export type DecisionData = Omit<IDecision, 'options'> & { options: Array<Omit<IOption, '_id'> & { _id?: string }> };

export interface IChapter {
  _id: Types.ObjectId;
  name: string;
  story: Readable[];
  /** Decisión del lector al terminar el capítulo (se expone como `decision`) */
  usersDecisions?: IDecision | null;
  endLocation?: EndLocation | null;
  items: string[];
  published: boolean;
  author?: string;
  writeDate?: Date;
  publishDate?: Date | null;
}

export interface INpc {
  _id: Types.ObjectId;
  name: string;
  npcType: string;
  title?: string;
  placeId?: Types.ObjectId;
  description?: ITale | null;
  meeting?: ITale | null;
  rejected?: ITale | null;
  decision?: IDecision | null;
  items: string[];
  chapters: IChapter[];
  author: string;
  published: boolean;
  writeDate?: Date;
  publishDate?: Date | null;
}

type DecisionOverrides = { options: Types.DocumentArray<IOption> };
type ChapterOverrides = { usersDecisions?: (IDecision & DecisionOverrides) | null };
type NpcOverrides = {
  chapters: Types.DocumentArray<IChapter & ChapterOverrides>;
  decision?: (IDecision & DecisionOverrides) | null;
};
type NpcModel = Model<INpc, object, NpcOverrides>;
export type NpcDoc = HydratedDocument<INpc, NpcOverrides>;
export type ChapterDoc = NpcDoc['chapters'][number];

const OptionSchema = new Schema<IOption>(
  {
    name: { type: String, default: '' },
    description: { type: String, default: '' },
    value: { type: String, default: '' },
    published: { type: Boolean, default: false },
    removeItem: { type: Boolean, default: false },
  },
  { toJSON: jsonOptions() },
);

const DecisionSchema = new Schema<IDecision>(
  {
    decisionType: { type: String, enum: ['choose', 'item', 'money'], default: 'choose' },
    amount: Number,
    item: String,
    options: { type: [OptionSchema], default: [] },
  },
  { _id: false, toJSON: jsonOptions() },
);

const EndLocationSchema = new Schema<EndLocation>(
  { endChapter: Boolean, cityId: String, placeId: String },
  { _id: false },
);

const ChapterSchema = new Schema<IChapter>(
  {
    name: { type: String, default: '' },
    story: { type: [ReadableSchema], default: [] },
    usersDecisions: { type: DecisionSchema, default: null },
    endLocation: { type: EndLocationSchema, default: null },
    items: { type: [String], default: [] },
    published: { type: Boolean, default: false },
    author: String,
    writeDate: { type: Date, default: Date.now },
    publishDate: { type: Date, default: null },
  },
  { toJSON: jsonOptions({ usersDecisions: 'decision' }) },
);

const NpcSchema = new Schema<INpc, NpcModel>(
  {
    name: { type: String, required: true, trim: true },
    npcType: { type: String, default: 'story' },
    title: String,
    placeId: { type: Schema.Types.ObjectId, index: true },
    description: { type: TaleSchema, default: null },
    meeting: { type: TaleSchema, default: null },
    rejected: { type: TaleSchema, default: null },
    decision: { type: DecisionSchema, default: null },
    items: { type: [String], default: [] },
    chapters: { type: [ChapterSchema], default: [] },
    author: { type: String, default: '' },
    published: { type: Boolean, default: false },
    writeDate: { type: Date, default: Date.now },
    publishDate: { type: Date, default: null },
  },
  { timestamps: true, toJSON: jsonOptions() },
);

NpcSchema.index({ 'chapters._id': 1 });

// Capítulos antiguos guardaban la historia como textos sueltos; se normalizan al leerlos
NpcSchema.pre('init', function (raw: { chapters?: { story?: unknown[] }[] }) {
  for (const chapter of raw.chapters ?? []) {
    if (Array.isArray(chapter.story)) {
      chapter.story = chapter.story.map((s) => (typeof s === 'string' ? { text: s } : s));
    }
  }
});

export const Npc = model<INpc, NpcModel>('Npcs', NpcSchema);
