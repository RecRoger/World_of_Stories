import { Request, Response } from 'express';
import UsersSchema, { UserInterface, CharacterInterface } from '../schemas/users.model';

class CharactersController {


    // get All Characters of an User
    public async getUserCharacters(req: Request, res: Response) {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('*************** getUserCharacters *******************');

            const { id } = req.body;
            const user: UserInterface | null = await UsersSchema.findOne(
                { _id: id },
                {
                    "characters": 1
                    // description: 0,
                    // travel: 0
                }
            ).lean();

            let characters: CharacterInterface[] = (user && user.characters) ? user.characters : [];

            const castChars = characters.map(character => {
                return {
                    ...character,
                    "id": character._id,
                }
            })

            console.log('_____________________________________________________');
            res.json({
                "data": { "characters": castChars }
            })
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })
        }
    }
    // New Character
    public async newCharacter(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('*************** newCharacter *******************');
            const { userId, name } = req.body;

            console.log('> userId: ' + userId);

            const edition: UserInterface[] = await UsersSchema.updateOne(
                { _id: userId },
                {
                    $push: {
                        characters: [{
                            name: name,
                            money: 1000,
                            items: [],
                            fragmentsRead: [],
                            animations: true
                        }]
                    }
                }
            ).lean();

            const user: UserInterface | null = await UsersSchema.findOne(
                { _id: userId },
                {
                    "characters": 1
                }
            ).lean();

            const character = (user && user.characters) ? user.characters.slice(-1)[0] : null;

            const castChar = character ? {
                ...character,
                id: character._id,
            } : null;

            console.log('> response: ' + ((character) ? (<CharacterInterface>character).name : 'Not Found'));
            console.log('_____________________________________________________');

            console.log('_____________________________________________________');
            res.json({
                "data": { "character": castChar }
            });

        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })

        }
    }

    // Add readFragment to an Character
    public async setCharacterFragmentRead(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('*************** setCharacterFragmentRead *******************');
            const { characterId, fragmentId } = req.body;

            console.log('> characterId: ' + characterId);

            const edition = await UsersSchema.updateOne(
                { "characters._id": characterId },
                {
                    $push: {
                        "characters.$.fragmentsRead": [fragmentId]
                    }
                }
            ).lean();

            console.log('> response: ' + ((edition && edition.nModified) ? 'OK' : 'Not Found'));
            console.log('_____________________________________________________');

            console.log('_____________________________________________________');
            res.json({
                "data": (edition && edition.nModified) ? 'OK' : 'error'
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })

        }
    }

    // Update Character
    public async updateCharacter(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('*************** updateCharacter *******************');
            const { character } = req.body;
            console.log('> characterId: ' + character.id);

            let setUpdates: any = {};

            if (character.name) {
                setUpdates['characters.$.name'] = character.name;
            }
            if (character.location) {
                setUpdates['characters.$.location'] = character.location;
            }
            if (character.money) {
                setUpdates['characters.$.money'] = character.money;
            }
            if (character.items) {
                setUpdates['characters.$.items'] = character.items;
            }
            if (character.animations || character.animations === false) {
                setUpdates['characters.$.animations'] = character.animations;
            }

            const updates: any = {};

            if (Object.keys(setUpdates).length > 0) updates['$set'] = setUpdates;

            const edition = await UsersSchema.updateOne(
                { "characters._id": character.id },
                updates
            ).lean();

            const findCharacter: UserInterface | null = await UsersSchema.findOne(
                { "characters._id": character.id },
                {
                    "characters": 1
                }
            ).lean();

            // console.log("> capitulos", findCharacter)
            const castCharacter = (findCharacter && findCharacter.characters) ? findCharacter.characters.find(c => c._id == character.id) : null;
            console.log('> response: ', castCharacter && castCharacter.name);
            console.log('_____________________________________________________');
            res.json({
                "data": { character: castCharacter ? { ...castCharacter, id: castCharacter._id } : null }
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })

        }
    }

    // Update Character
    public async deleteCharacter(req: Request, res: Response): Promise<void> {
        try {
            console.log('.');
            console.log('________________________________________________');
            console.log('*************** deleteCharacter *******************');
            const { id } = req.body;
            console.log('> characterId: ' + id);

            const edition = await UsersSchema.updateOne(
                { "characters._id": id },
                {
                    $pull: {
                        characters: {
                            _id: id
                        }
                    }
                }
            );
            console.log('===================== ' + ((edition.nModified) ? 'OK' : 'not Found') + ' ======================');
            console.log('_____________________________________________________');
            res.json({
                "data": (edition.nModified) ? 'OK' : 'error'
            });
        } catch (err) {
            console.log('Error ---->', err);
            console.log('_____________________________________________________');
            res.json({
                "error": err
            })

        }
    }




}


export const charactersController = new CharactersController();