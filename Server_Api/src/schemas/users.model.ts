import { Document, Schema, model } from 'mongoose';

export interface UserInterface extends Document {
    _id: string,
    username: string,
    password: string,
    rol: string[],
    characters?: CharacterInterface[]
}

export interface CharacterInterface {
    _id?: string,
    name?: string,
    location?: {
        cityId?: string,
        placeId?: string,
        npcId?: string,
        chapterId?: string
    },
    money?: number,
    items?: string[],
    fragmentsRead?: string[],
}

const UsersSchema = new Schema({
    username: String,
    password: String,
    rol: [String],
    characters: [{
        name: String,
        location: {
            cityId: String,
            placeId: String,
            npcId: String,
            chapterId: String,
        },
        money: Number,
        items: [String],
        fragmentsRead: [String]
    }]
})


export default model<UserInterface>('user', UsersSchema);