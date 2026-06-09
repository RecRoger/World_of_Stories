// src/schemas/npcs.model.ts
import { Document, model, Schema } from 'mongoose';
import { TaleInterface, ReadableInterface } from './tale.model.js';

export interface ChapterLocationInterface {
    endChapter?: boolean;
    cityId?: string;    // ID de la ciudad de retorno
    placeId?: string;   // ID del lugar de retorno
}
export interface OptionInterface {
    name: string; // Para identificar la opción internamente en edición
    description: string; // Opción que lee el jugador en Angular
    value: string; // ID del capítulo apuntado (Next node ID)
    published?: boolean;
    removeItem?: boolean;
}
export interface DecisionInterface {
    decisionType: string; // 'choose', 'item', 'money'
    amount?: number;
    item?: string;
    options: OptionInterface[];
}

export interface ChapterInterface extends Document {
    id: string;
    name?: string;
    story?: ReadableInterface[];
    usersDecisions?: DecisionInterface;
    endLocation?: ChapterLocationInterface;
    items?: string[];
    published?: boolean;
    author?: string;
    writeDate?: Date;
    publishDate?: Date;
}

export interface NpcInterface extends Document {
    id: string;
    name?: string;
    npcType?: string; // 'historias', 'tienda', 'posta', etc.
    description?: TaleInterface;
    meeting?: TaleInterface;
    decision?: DecisionInterface;
    rejected?: TaleInterface;
    items?: string[]; // Inventario en caso de ser tienda
    title?: string; // Título de su arco narrativo
    chapters?: ChapterInterface[];
    author?: string;
    published?: boolean;
    writeDate?: Date;
    publishDate?: Date;
}

// Sub-esquema reusable de decisiones para NPCs y Capítulos
export const NpcsSchemaDecision = {
    decisionType: { type: String },
    amount: { type: Number },
    item: { type: String },
    options: [{
        name: { type: String },
        description: { type: String },
        value: { type: String },
        published: { type: Boolean },
        removeItem: { type: Boolean }
    }]
};

const ChaptersSchema = new Schema<ChapterInterface>({
    name: { type: String },
    story: [{
        text: { type: String },
        animation: { type: String }
    }],
    usersDecisions: NpcsSchemaDecision, // Reutilizamos la subestructura de decisiones
    endLocation: {
        endChapter: { type: Boolean },
        cityId: { type: String },
        placeId: { type: String }
    },
    items: [String],
    published: { type: Boolean, default: false },
    author: { type: String },
    writeDate: { type: Date, default: Date.now },
    publishDate: { type: Date }
}, {
    timestamps: true
});

const NpcsSchema = new Schema<NpcInterface>({
    name: { type: String },
    npcType: { type: String },
    description: {
        tale: [{ text: String, animation: String }],
        author: String,
        published: Boolean,
        writeDate: Date,
        publishDate: Date,
    },
    meeting: {
        tale: [{ text: String, animation: String }],
        author: String,
        published: Boolean,
        writeDate: Date,
        publishDate: Date,
    },
    decision: NpcsSchemaDecision,
    rejected: {
        tale: [{ text: String, animation: String }],
        author: String,
        published: Boolean,
        writeDate: Date,
        publishDate: Date,
    },
    items: [String],
    title: { type: String },
    chapters: [ChaptersSchema], // Subdocumentos embebidos tipados de forma nativa
    published: { type: Boolean, default: false },
    author: { type: String },
    writeDate: { type: Date, default: Date.now },
    publishDate: { type: Date }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export default model<NpcInterface>('Npcs', NpcsSchema);