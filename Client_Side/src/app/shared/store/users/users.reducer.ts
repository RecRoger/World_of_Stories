import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import {
  LoginUser,
  SigninUser,
  LogonUser,
  AddUserRoll,
  UpdateUserData,
  GetCharacters,
  NewCharacter,
  DeleteCharacter,
  SelectCharacter,
  UpdateCharacterLocation,
  SetReadFragment
} from './users.actions';
import {
  SetError,
  SetInfo
} from '../general/general.actions';
import {
  UsersService,
  User,
  RequestGetUser,
  ResponseGetUser,
  Character,
  RequestGetCharacters,
  ResponseGetCharacters,
  RequestNewCharacter,
  ResponseNewCharacter,
  RequestDeleteCharacter,
  ResponseDeleteCharacter,
  RequestUpdateCharacter,
  RequestReadFragment
} from 'src/client-api';
import { patch, updateItem, append, removeItem } from '@ngxs/store/operators';

export interface UserStateModel {
  activedUser: User;
  character: Character;
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    activedUser: (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))) || null,
    character: (localStorage.getItem('character') && JSON.parse(localStorage.getItem('character'))) || null
  }
})
@Injectable()
export class UserState {

  constructor(private store: Store, private userService: UsersService) {

  }

  @Selector()
  static getUser(state: UserStateModel): User {
    return state.activedUser;
  }
  @Selector()
  static getCharacter(state: UserStateModel): Character {
    return state.character;
  }

  @Action(LogonUser)
  async LogonUser(ctx: StateContext<UserStateModel>, action: LogonUser) {
    ctx.patchState({
      activedUser: null
    });
  }

  @Action(LoginUser)
  async LoginUser(ctx: StateContext<UserStateModel>, action: LoginUser) {

    try {
      const resp = await this.userService.login(action.payload).toPromise();
      if (resp && resp.data && resp.data.user) {
        const user: User = resp.data.user;

        localStorage.setItem('user', JSON.stringify(user));
        ctx.patchState({
          activedUser: user
        });
        return true;
      } else {
        this.store.dispatch(new SetError('No se ha encontrado usuario con esa clave y contraseña. Revise los datos.'));
        return false;
      }
    } catch (err) {
      console.log('*** ERROR ***', err);

      this.store.dispatch(new SetError('Ha ocurrido un problema consultando su usuario. Intente mas tarde'));
      return false;
    }
  }

  @Action(SigninUser)
  async SigninUser(ctx: StateContext<UserStateModel>, action: SigninUser) {

    try {
      const resp = await this.userService.signin(action.payload).toPromise();
      // if (resp) {
      if (resp && resp.data && resp.data.user) {
        const user: User = {};
        user.id = resp.data.user.id;
        user.username = resp.data.user.username;
        user.password = resp.data.user.password;
        user.characters = resp.data.user.characters;
        user.rol = resp.data.user.rol;

        this.store.dispatch(new SetInfo('Usuario añadido. Vuelve para registrarte'));
      } else {
        this.store.dispatch(new SetError('Ha ocurrido un creando su usuario. Intente mas tarde'));
      }
    } catch (err) {
      console.log('*** ERROR ***', err);
      this.store.dispatch(new SetError('Ha ocurrido un creando su usuario. Intente mas tarde'));
    }
  }

  @Action(AddUserRoll)
  async AddUserRoll(ctx: StateContext<UserStateModel>, action: AddUserRoll) {

    try {

      const resp = await this.userService.setRol(action.payload).toPromise();

      if (resp && resp.data && resp.data.user) {
        ctx.dispatch(new UpdateUserData());
        this.store.dispatch(new SetInfo('Nuevo Rol añadido a usuario'));

      } else {
        this.store.dispatch(new SetError('No se ha encontrado usuario con esa clave y contraseña. Revise los datos.'));
      }
    } catch (err) {
      console.log('*** ERROR ***', err);
      this.store.dispatch(new SetError('Ha ocurrido un problema consultando su usuario. Intente mas tarde'));
    }
  }
  @Action(UpdateUserData)
  async UpdateUserData(ctx: StateContext<UserStateModel>, action: UpdateUserData) {

    try {

      let user = action.payload;

      if (!user) {

        const req: RequestGetUser = {
          id: ctx.getState().activedUser.id
        };
        const resp: ResponseGetUser = await this.userService.getUser(req).toPromise();
        user = resp.data && resp.data.user;

      }
      if (user) {
        localStorage.setItem('user', JSON.stringify(user));
        ctx.patchState({
          activedUser: user
        });
      } else {
        this.store.dispatch(new SetError('No se ha encontrado usuario con esa clave y contraseña. Revise los datos.'));
      }

    } catch (err) {
      console.log('*** ERROR ***', err);
      this.store.dispatch(new SetError('Ha ocurrido un problema consultando su usuario. Intente mas tarde'));
    }
  }



  @Action(GetCharacters)
  async GetCharacters(ctx: StateContext<UserStateModel>, action: GetCharacters) {

    try {

      const user = ctx.getState().activedUser;
      let users = [];

      // if (!user.characters || user.characters.length <= 0) {
      // }

      const req: RequestGetCharacters = {
        id: ctx.getState().activedUser.id
      };
      const resp: ResponseGetCharacters = await this.userService.getCharacters(req).toPromise();
      users = resp.data && resp.data.characters || [];

      ctx.setState(patch({
        activedUser: patch<User>({
          characters: users
        })
      }));

    } catch (err) {
      console.log('*** ERROR ***', err);
      this.store.dispatch(new SetError('Ha ocurrido un problema consultando su usuario. Intente mas tarde'));
    }
  }
  @Action(NewCharacter)
  async NewCharacters(ctx: StateContext<UserStateModel>, action: NewCharacter) {

    try {

      const req: RequestNewCharacter = {
        ...action.payload
      };

      const resp: ResponseNewCharacter = await this.userService.newCharacter(req).toPromise();

      if (resp.data && resp.data.character) {

        ctx.setState(patch({
          activedUser: patch<User>({
            characters: append([resp.data.character])
          })
        }));

      } else {
        this.store.dispatch(new SetError('Ha ocurrido un problema creando el personaje.'));
      }


    } catch (err) {
      console.log('*** ERROR ***', err);
      this.store.dispatch(new SetError('Ha ocurrido un problema creando el personaje. Intente mas tarde'));
    }
  }
  @Action(DeleteCharacter)
  async DeleteCharacters(ctx: StateContext<UserStateModel>, action: DeleteCharacter) {

    try {

      const req: RequestDeleteCharacter = {
        ...action.payload
      };

      const resp: ResponseDeleteCharacter = await this.userService.deleteCharacter(req).toPromise();

      if (resp.data && resp.data === 'OK') {

        ctx.setState(patch({
          activedUser: patch<User>({
            characters: removeItem<Character>(c => c.id === req.id)
          })
        }));

      } else {
        this.store.dispatch(new SetError('Ha ocurrido un problema creando el personaje.'));
      }


    } catch (err) {
      console.log('*** ERROR ***', err);
      this.store.dispatch(new SetError('Ha ocurrido un problema creando el personaje. Intente mas tarde'));
    }
  }


  @Action(SelectCharacter)
  async SelectCharacters(ctx: StateContext<UserStateModel>, action: SelectCharacter) {

    try {

      let character = action.payload;

      localStorage.setItem('character', JSON.stringify(character));
      ctx.setState(patch<UserStateModel>({
        activedUser: patch<User>({
          characters: updateItem(c => c.id === character.id, character)
        }),
        character: {
          ...character
        }
      }));

    } catch (err) {
      console.log('*** ERROR ***', err);
      this.store.dispatch(new SetError('Ha ocurrido un problema creando el personaje. Intente mas tarde'));
    }
  }

  @Action(UpdateCharacterLocation)
  async UpdateCharacterLocation(ctx: StateContext<UserStateModel>, action: UpdateCharacterLocation) {

    try {

      const location = action.payload;
      const id = ctx.getState().character.id;

      const req: RequestUpdateCharacter = {
        character: {
          id,
          location
        }
      };

      const resp = await this.userService.updateCharacter(req).toPromise();

      if (resp.data && resp.data.character) {

        ctx.setState(patch<UserStateModel>({
          character: {
            ...resp.data.character
          }
        }));

      } else {
        this.store.dispatch(new SetError('error guardando'));
      }


    } catch (err) {
      console.log('*** ERROR ***', err);
      this.store.dispatch(new SetError('Ha ocurrido un problema guardando'));
    }
  }


  @Action(SetReadFragment)
  async SetReadFragment(ctx: StateContext<UserStateModel>, action: SetReadFragment) {

    try {

      const { fragmentId } = action.payload;
      const character = ctx.getState().character;
      const characterId = character.id;

      if (!character.fragmentsRead && !character.fragmentsRead.includes(fragmentId)) {

        const req: RequestReadFragment = {
          characterId,
          fragmentId
        };

        const resp = await this.userService.readFragment(req).toPromise();

        if (resp.data && resp.data === 'OK') {

          ctx.setState(patch<UserStateModel>({
            character: patch<Character>({
              fragmentsRead: append([fragmentId])
            })
          }));

        } else {
          this.store.dispatch(new SetError('error guardando'));
        }

      }

    } catch (err) {
      console.log('*** ERROR ***', err);
      this.store.dispatch(new SetError('Ha ocurrido un problema guardando'));
    }
  }







}
