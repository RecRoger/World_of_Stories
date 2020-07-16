import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { RequestService } from '../../../shared/services/request.service';
import { GetUserURL, GetUserRequest, GetUserResponse } from '../../../shared/models/api_models/getUsers.model';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { AddUserResponse, AddUsersURL } from 'src/app/shared/models/api_models/addUser.model';
import { AddUserRequest } from '../../../shared/models/api_models/addUser.model';
import { UserModel } from '../../../shared/models/client_models/user.model';
import { Store } from '@ngxs/store';
import { LoginUser, SigninUser } from 'src/app/shared/store/users/users.actions';
import { isValid } from 'src/app/shared/utils/commons';
import { RequestSignin } from 'src/client-api';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {

  loginForm: FormGroup;
  loading = false;
  errorMsg: string;
  successMsg: string;
  type: boolean;    // true para signin, false para login

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store,
    private http: HttpClient,
    private cd: ChangeDetectorRef
  ) { }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [
        Validators.required,
        // Validators.email
      ]],
      password: ['', [
        Validators.required
      ]],
      confirmation: ['', [
        // Validators.required
      ]]
    });
  }

  back() {
    this.router.navigate(['/']);
  }

  changeMode(mode: boolean) {
    // mode es el tipo, true para sign y false para login
    this.type = mode;
    if (mode) {
      this.loginForm.get('confirmation').setValidators(Validators.required);
      this.loginForm.get('confirmation').setValue('');
      this.loginForm.setValidators(this.checkPasswords);
    } else {
      this.loginForm.get('confirmation').setValidators(null);
      this.loginForm.setValidators(null);
    }
    this.cd.markForCheck();

  }

  async login() {
    this.errorMsg = null;
    if (isValid(this.loginForm)) {

      this.loading = true;
      const loginReq: GetUserRequest = {
        password: this.loginForm.value.password,
        username: this.loginForm.value.username
      };

      const state = await this.store.dispatch(new LoginUser(loginReq)).toPromise();
      if (state.user && state.user.activedUser) {
        this.router.navigate(['/write-or-read']);
        this.loading = false;
      } else {
        this.loading = false;
      }

    }
    this.cd.markForCheck();
  }

  async signin() {
    this.errorMsg = null;
    if (isValid(this.loginForm)) {

      this.loading = true;

      const signReq: RequestSignin = {
        user: {
          username: this.loginForm.get('username').value,
          password: this.loginForm.get('password').value
        }
      };
      await this.store.dispatch(new SigninUser(signReq)).toPromise();

      this.loading = false;

    }
    this.cd.markForCheck();
  }


  checkPasswords(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmation.value;

    return pass === confirmPass ? null : { notSame: true };
  }
}
