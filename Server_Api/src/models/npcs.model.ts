import mongoose, { Schema, model } from 'mongoose';
import { publicTale, decisionOption, readFragment } from './common.model';

export interface NpcInterface extends mongoose.Document {
    _id: string,
    name?: string,		       // nombre aislado del personaje
    npc_type?: string, 		   // lugar de 'historias', 'tienda', 'posta de caballos' etc.
    description?: publicTale, // descripciones del personaje, presentacion general, corta.
    meeting?: publicTale,       // presentacion del personaje y su polemica, cierra en pregunta
    decision?: decisionOption[],
    rejected?: publicTale,      // narracion de rechazo
    items?: string[]	       // items del npc (tienda);
    title?: string		       // Titulo de la historia
    chapters?: ChapterInterface[]
    author?:string,
    published?: boolean,
    write_date?:Date;     // Fecha de creacion
    publish_date?: Date
}

export interface ChapterInterface {
    _id: string,
    name?: string
    story?: readFragment[],	                // narracion previa a batalla o decision.
    usersDecisions?: decisionOption[],
    end_location?: {
        location_Type?: string,    // place or city
        location_id?: string       // id del lugar de retorno del capiulo
    }
    // itemsDecisions?: decisionOption[],
    // considerar
    // tipo de batalla?: string		    // orda, medium, boss (algoritmo de creacion)
    // enemigo?: Enemy_Character         // enemigo de la batalla
    // defeat?: string		            // narracion de derrota en batalla.
    item?: string[]		                // Item en caso de victoria
    published?: boolean,
    author?:string,
    write_date?:Date;     // Fecha de creacion
    publish_date?:Date;   // Fecha de publicacion
    
}


const NpcsSchema = new Schema({
    name: String,
    npc_type: String,
    description: {
        tale: [{
            text: String,
            animation: String
        }],
        author: String,
        published: Boolean,
        write_date: Date,
        publish_date: Date,
    },
    meeting: {
        tale: [{
            text: String,
            animation: String
        }],
        author: String,
        published: Boolean,
        write_date: Date,
        publish_date: Date,
    },
    decision: [{
        name: String,
        description: String,
        value: String
    }],
    rejected: {
        tale: [{
            text: String,
            animation: String
        }],
        author: String,
        published: Boolean,
        write_date: Date,
        publish_date: Date,
    },
    items: [String],
    title: String,
    chapters: [{
        name: String,
        story: [{
            text: String,
            animation: String
        }],	                // narracion previa a batalla o decision.
        usersDecisions: [{
            name: String,
            description: String,
            value: String,
            published: Boolean
        }],
        end_location: {
            location_Type: String,    // place or city
            location_id: String       // id del lugar de retorno del capiulo
        },
        // itemsDecisions: decisionOption[],
        // considerar
        // tipo de batalla: String		    // orda, medium, boss (algoritmo de creacion)
        // enemigo: Enemy_Character         // enemigo de la batalla
        // defeat: String		            // narracion de derrota en batalla.
        item: [String],		                // Item en caso de victoria
        published: Boolean,
        author:String,
        write_date:Date,    // Fecha de creacion
        publish_date: Date
    }],
    published: Boolean,
    author:String,
    write_date:Date,    // Fecha de creacion
    publish_date:Date,   // Fecha de publicacion
})

export default model<NpcInterface>('npcs', NpcsSchema);
