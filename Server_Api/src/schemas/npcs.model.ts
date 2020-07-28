import mongoose, { Schema, model } from 'mongoose';
import { publicTale, decisionOption, readFragment, decisionObject, chapterLocation } from './common.model';

export interface NpcInterface extends mongoose.Document {
    _id: string,
    name?: string,		       // nombre aislado del personaje
    npcType?: string, 		   // lugar de 'historias', 'tienda', 'posta de caballos' etc.
    description?: publicTale, // descripciones del personaje, presentacion general, corta.
    meeting?: publicTale,       // presentacion del personaje y su polemica, cierra en pregunta
    decision?: decisionObject,
    rejected?: publicTale,      // narracion de rechazo
    items?: string[]	       // items del npc (tienda);
    title?: string		       // Titulo de la historia
    chapters?: ChapterInterface[]
    author?: string,
    published?: boolean,
    writeDate?: Date;     // Fecha de creacion
    publishDate?: Date
}

export interface ChapterInterface {
    _id: string,
    name?: string
    story?: readFragment[],	                // narracion previa a batalla o decision.
    usersDecisions?: decisionObject,
    endLocation?: chapterLocation
    items?: string[]		                // Item en caso de victoria
    published?: boolean,
    author?: string,
    writeDate?: Date;     // Fecha de creacion
    publishDate?: Date;   // Fecha de publicacion

}


const NpcsSchema = new Schema({
    name: String,
    npcType: String,
    description: {
        tale: [{
            text: String,
            animation: String
        }],
        author: String,
        published: Boolean,
        writeDate: Date,
        publishDate: Date,
    },
    meeting: {
        tale: [{
            text: String,
            animation: String
        }],
        author: String,
        published: Boolean,
        writeDate: Date,
        publishDate: Date,
    },
    decision: {
        decisionType: String,
        amount: Number,
        item: String,
        options: [{
            name: String,
            description: String,
            value: String,
            published: Boolean,
            removeItem: Boolean
        }]
    },
    rejected: {
        tale: [{
            text: String,
            animation: String
        }],
        author: String,
        published: Boolean,
        writeDate: Date,
        publishDate: Date,
    },
    items: [String],
    title: String,
    chapters: [{
        name: String,
        story: [{
            text: String,
            animation: String
        }],	                // narracion previa a batalla o decision.
        usersDecisions: {
            decisionType: String,
            amount: Number,
            item: String,
            options: [{
                name: String,
                description: String,
                value: String,
                published: Boolean,
                removeItem: Boolean
            }]
        },
        endLocation: {
            endChapter: Boolean,    // place or city
            cityId: String,    // place or city
            placeId: String       // id del lugar de retorno del capiulo
        },
        items: [String],		                // Item en caso de victoria
        published: Boolean,
        author: String,
        writeDate: Date,    // Fecha de creacion
        publishDate: Date
    }],
    published: Boolean,
    author: String,
    writeDate: Date,    // Fecha de creacion
    publishDate: Date,   // Fecha de publicacion
})

export default model<NpcInterface>('npcs', NpcsSchema);
