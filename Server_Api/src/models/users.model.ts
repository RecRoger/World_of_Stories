import mongoose, { Schema, model } from 'mongoose';

export interface UserInterface extends mongoose.Document {
    _id: string,
    username: string,
    password: string,
    rol: string[],
    characters?: string[]
}

const UsersSchema = new Schema({
    username: String,
    password: String,
    rol: [String],
    characters: [String]
})

export default model<UserInterface>('user', UsersSchema);