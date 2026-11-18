import { Schema, model, type HydratedDocument, type Model, type Types } from 'mongoose';
import { ROLES, type Location, type Role } from '@wos/shared';
import { jsonOptions } from './json.js';

/** Una entrada del inventario: un objeto del catálogo y cuántos tiene */
export interface IInventoryEntry {
  itemId: string;
  quantity: number;
}

export interface ICharacter {
  _id: Types.ObjectId;
  location?: Location | null;
  money: number;
  items: IInventoryEntry[];
  fragmentsRead: string[];
  /** Capítulos cuya recompensa de dinero ya cobró (al releerlos solo vuelve a cobrar si tiene menos de lo que dan) */
  rewardsClaimed: string[];
  animations: boolean;
}

export interface IUser {
  _id: Types.ObjectId;
  email: string;
  username: string;
  password: string;
  /** Se expone como `roles` */
  role: Role[];
  characters: ICharacter[];
  createdAt: Date;
  updatedAt: Date;
}

type UserOverrides = { characters: Types.DocumentArray<ICharacter> };
type UserModel = Model<IUser, object, UserOverrides>;
export type UserDoc = HydratedDocument<IUser, UserOverrides>;

const LocationSchema = new Schema<Location>(
  { cityId: String, placeId: String, npcId: String, chapterId: String },
  { _id: false },
);

const InventoryEntrySchema = new Schema<IInventoryEntry>(
  { itemId: { type: String, required: true }, quantity: { type: Number, required: true, min: 1 } },
  { _id: false },
);

const CharacterSchema = new Schema<ICharacter>(
  {
    location: { type: LocationSchema, default: null },
    money: { type: Number, default: 1000 },
    items: { type: [InventoryEntrySchema], default: [] },
    fragmentsRead: { type: [String], default: [] },
    rewardsClaimed: { type: [String], default: [] },
    animations: { type: Boolean, default: true },
  },
  { toJSON: jsonOptions() },
);

const UserSchema = new Schema<IUser, UserModel>(
  {
    email: { type: String, required: true, unique: true, trim: true, lowercase: true },
    username: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true, select: false },
    role: { type: [String], enum: ROLES, default: ['Reader'] },
    characters: { type: [CharacterSchema], default: [] },
  },
  { timestamps: true, toJSON: jsonOptions({ role: 'roles' }, ['password', 'characters']) },
);

export const User = model<IUser, UserModel>('Users', UserSchema);
