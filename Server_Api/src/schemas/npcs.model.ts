import { Schema, model } from 'mongoose';


const NpcsSchema = new Schema({
    name: String,            // nombre aislado del personaje
    npcType: String,         // lugar de 'historias', 'tienda', 'posta de caballos' etc.
    description: {
        tale: [{
            text: String,
            animation: String
        }],
        author: String,
        published: Boolean,
        writeDate: Date,
        publishDate: Date,
    },                       // descripciones del personaje, presentacion general, corta.
    meeting: {
        tale: [{
            text: String,
            animation: String
        }],
        author: String,
        published: Boolean,
        writeDate: Date,
        publishDate: Date,
    },                      // presentacion del personaje y su polemica, cierra en pregunta
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
    },                      // narracion de rechazo
    items: [String],        // items del npc (tienda);
    title: String,          // Titulo de la historia
    chapters: [{
        name: String,
        story: [{
            text: String,
            animation: String
        }],                 // narracion previa a batalla o decision.
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
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
})

export default model('npcs', NpcsSchema);
