import { Document, Schema, model } from 'mongoose';

// 1. Interfaces para TypeScript (Tipado estricto de los datos)
export interface UserInterface extends Document {
    email: string,
    username: string,
    password: string,
    rol: string[],
    characters?: CharacterInterface[]
    createdAt: Date;
    updatedAt: Date;
}

export interface CharacterInterface {
    name?: string,
    location?: LocationInterface,
    money?: number,
    items?: string[],
    fragmentsRead?: string[],
    animations?: boolean
}

export interface LocationInterface {
    cityId?: string,
    placeId?: string,
    npcId?: string,
    chapterId?: string
}

// Subesquema de Ubicación (Location)
const LocationSchema = new Schema<LocationInterface>({
    cityId: { type: String, required: true },
    placeId: { type: String, required: true },
    npcId: { type: String, default: '' },
    chapterId: { type: String, default: '' }
}, { _id: false });

// Subesquema de Personaje (Character)
const CharacterSchema = new Schema<CharacterInterface>({
    name: { type: String, required: [true, 'El nombre del personaje es obligatorio'], trim: true },
    location: { type: LocationSchema, required: true },
    money: { type: Number, default: 0 },
    items: { type: [String], default: [] },
    fragmentsRead: { type: [String], default: [] },
    animations: { type: Boolean, default: true }
});

// 4. Esquema Principal de Usuario
const UsersSchema = new Schema<UserInterface>({
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true,
        trim: true,
        lowercase: true // Guarda siempre el email en minúsculas para evitar duplicados por capitalización
    },
    username: {
        type: String,
        required: [true, 'El nombre de usuario es obligatorio'],
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: [true, 'La contraseña es obligatoria']
    },
    rol: {
        type: [String],
        default: ['Reader']
    },
    characters: {
        type: [CharacterSchema],
        default: []
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

export default model<UserInterface>('User', UsersSchema);