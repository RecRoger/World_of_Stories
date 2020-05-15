import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UserModel } from 'src/app/shared/models/client_models/user.model';
import { Router } from '@angular/router';
import { UsersRoles } from 'src/app/shared/constants';
import { AddUserRolRequest, AddUserRolURL, AddUserRolResponse } from '../../../shared/models/api_models/addUserRol.model';
import { ResponseModel } from 'src/app/shared/models/client_models/response.model';
import { HttpClient } from '@angular/common/http';
import { Store } from '@ngxs/store';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { AddUserRoll } from 'src/app/shared/store/users/users.actions';

@Component({
  selector: 'app-write-or-read',
  templateUrl: './write-or-read.component.html',
  styleUrls: ['./write-or-read.component.scss']
})
export class WriteOrReadComponent implements OnInit {

  constructor(
    private cd: ChangeDetectorRef,
    private store: Store,
    private router: Router,
    private http: HttpClient,
  ) { }

  user: UserModel;
  rolConfirmation = '';

  loading = false;
  errorMsg = '';


  ngOnInit() {
    this.user = this.store.selectSnapshot(UserState.getUser);
  }

  getOut() {
    this.router.navigate(['/']);
  }

  userChooseActivity(activity: boolean) {
    // true para escribir
    const roles: string[] = [...this.user.rol];
    if (activity) {
      if (roles.includes(UsersRoles.W) || roles.includes(UsersRoles.A)) {
        this.startActivity(activity);
      } else {
        this.rolConfirmation = 'W';
      }
    } else {
      if (roles.includes(UsersRoles.R)) {
        this.startActivity(activity);
      } else {
        this.rolConfirmation = 'R';
      }
    }
  }

  async addRol(rol) {
    this.rolConfirmation = '';
    this.loading = true;
    this.cd.markForCheck();
    const data: AddUserRolRequest = {
      id: this.user._id,
      rol: (rol === 'W') ? UsersRoles.W : UsersRoles.R
    };
    await this.store.dispatch(new AddUserRoll(data)).toPromise();
    this.startActivity((rol === 'W') ? true : false);
    this.loading = false;
    this.cd.markForCheck();
  }

  startActivity(action: boolean) {
    if (action) {
      this.router.navigate(['/writers']);
    } else {
      alert('en desarrollo');
    }
  }
}
