import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector, Store } from '@ngxs/store';
import { LoginUser, SigninUser, LogonUser, AddUserRoll, UpdateUserData } from './users.actions';
import { SetError, SetInfo } from '../general/general.actions';
import { UsersService, User, RequestGetUser, ResponseGetUser, Character } from 'src/client-api';

export interface UserStateModel {
  activedUser: User;
  character: Character;
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    activedUser: (localStorage.getItem('user') && JSON.parse(localStorage.getItem('user'))) || null,
    character: null
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





}
