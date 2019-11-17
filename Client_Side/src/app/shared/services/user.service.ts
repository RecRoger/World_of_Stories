import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { UserModel } from 'src/app/shared/models/client_models/user.model';
import { HttpClient } from '@angular/common/http';
import { GetUserByIdRequest, GetUserResponse, GetUsersByIdURL } from 'src/app/shared/models/api_models/getUsers.model';
import { ResponseModel } from 'src/app/shared/models/client_models/response.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private activeUser = new BehaviorSubject<UserModel>(new UserModel());

  constructor(private http: HttpClient) { }

  async updateActiveUser(data?: UserModel) {
    if (!data) {
      try {
        const req: GetUserByIdRequest = {
          id: this.activeUserSnapchat._id
        };

        const resp: ResponseModel<GetUserResponse> = await this.http.post(GetUsersByIdURL, req).toPromise();
        if (resp && resp.data && resp.data.user) {
          data = resp.data.user;
        }
      } catch (err) {
        console.log('*** ERROR ***', err);
      }
    }
    localStorage.setItem('user', JSON.stringify(data));
    this.activeUser.next(data);
  }

  get activeUserSnapchat(): UserModel {
    if (Object.keys(this.activeUser.value).length <= 0 && localStorage.getItem('user')) {
      const data = JSON.parse(localStorage.getItem('user'));
      this.activeUser.next(data);
    }
    return { ...this.activeUser.value };
  }

}
