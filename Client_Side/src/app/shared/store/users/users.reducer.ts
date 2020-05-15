import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { UserModel } from '../../models/client_models/user.model';
import { LoginUser, SigninUser, LogonUser, AddUserRoll, UpdateUserData } from './users.actions';
import { ResponseModel } from '../../models/client_models/response.model';
import { GetUserResponse, GetUserURL, GetUsersByIdURL } from '../../models/api_models/getUsers.model';
import { HttpClient } from '@angular/common/http';
import { AddUserResponse, AddUsersURL } from '../../models/api_models/addUser.model';
import { AddUserRolURL, AddUserRolResponse } from '../../models/api_models/addUserRol.model';
import { SetLoader, SetError } from '../general/general.actions';

export interface UserStateModel {
  activedUser: UserModel;
}

@State<UserStateModel>({
  name: 'user',
  defaults: {
    activedUser: null
  }
})
@Injectable()
export class UserState {

  constructor(private http: HttpClient) {

  }

  @Selector()
  static getUser(state: UserStateModel): UserModel {
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

    // ctx.dispatch(new SetLoader(true));
    try {
      const resp: ResponseModel<GetUserResponse> = await this.http.post(GetUserURL, action.payload).toPromise();
      if (resp && resp.data && resp.data.user) {
        const user: UserModel = resp.data.user;

        localStorage.setItem('user', JSON.stringify(user));
        ctx.patchState({
          activedUser: user
        });

        // ctx.dispatch(new SetLoader(false));
        return true;
      } else {
        ctx.dispatch(new SetError('No se ha encontrado usuario con esa clave y contraseña. Revise los datos.'));
        // ctx.dispatch(new SetLoader(false));
        return false;
      }
    } catch (err) {
      console.log('*** ERROR ***', err);
      // ctx.dispatch(new SetLoader(false));
      ctx.dispatch(new SetError('Ha ocurrido un problema consultando su usuario. Intente mas tarde'));
      return false;
    }
  }

  @Action(SigninUser)
  async SigninUser(ctx: StateContext<UserStateModel>, action: SigninUser) {

    try {
      const resp: ResponseModel<AddUserResponse> = await this.http.post(AddUsersURL, action.payload).toPromise();
      // if (resp) {
      if (resp && resp.data && resp.data.user) {
        const user: UserModel = new UserModel();
        user._id = resp.data.user._id;
        user.username = resp.data.user.username;
        user.password = resp.data.user.password;
        user.characters = resp.data.user.characters;
        user.rol = resp.data.user.rol;
      } else {
        ctx.dispatch(new SetError('Ha ocurrido un creando su usuario. Intente mas tarde'));
      }
    } catch (err) {
      console.log('*** ERROR ***', err);
      ctx.dispatch(new SetError('Ha ocurrido un creando su usuario. Intente mas tarde'));
    }
  }

  @Action(AddUserRoll)
  async AddUserRoll(ctx: StateContext<UserStateModel>, action: AddUserRoll) {

    try {
      const resp: ResponseModel<AddUserRolResponse> = await this.http.post(AddUserRolURL, action.payload).toPromise();

      if (resp && resp.data && resp.data.nModified) {
        ctx.dispatch(new UpdateUserData());

      } else {
        ctx.dispatch(new SetError('No se ha encontrado usuario con esa clave y contraseña. Revise los datos.'));
      }
    } catch (err) {
      console.log('*** ERROR ***', err);
      ctx.dispatch(new SetError('Ha ocurrido un problema consultando su usuario. Intente mas tarde'));
    }
  }


  @Action(UpdateUserData)
  async UpdateUserData(ctx: StateContext<UserStateModel>, action: UpdateUserData) {

    try {

      const req = {
        id: ctx.getState().activedUser._id
      };
      const resp: ResponseModel<GetUserResponse> = await this.http.post(GetUsersByIdURL, req).toPromise();

      if (resp && resp.data && resp.data.user) {
        const user: UserModel = resp.data.user;

        localStorage.setItem('user', JSON.stringify(user));
        ctx.patchState({
          activedUser: user
        });

      } else {
        ctx.dispatch(new SetError('No se ha encontrado usuario con esa clave y contraseña. Revise los datos.'));
      }
    } catch (err) {
      console.log('*** ERROR ***', err);
      ctx.dispatch(new SetError('Ha ocurrido un problema consultando su usuario. Intente mas tarde'));
    }
  }





}
