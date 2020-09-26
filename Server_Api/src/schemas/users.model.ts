import { Document, Schema, model } from 'mongoose';

export interface UserInterface extends Document {
    _id: string,
    email: string,
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
    animations?: boolean
}

const UsersSchema = new Schema({
    email: String,
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
        fragmentsRead: [String],
        animations: Boolean
    }]
})


export default model<UserInterface>('user', UsersSchema);