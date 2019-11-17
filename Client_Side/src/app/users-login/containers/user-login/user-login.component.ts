import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { RequestService } from '../../../shared/services/request.service';
import { GetUsersURL, GetUserRequest, GetUserResponse } from '../../../shared/models/api_models/getUsers.model';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { AddUserResponse, AddUsersURL } from 'src/app/shared/models/api_models/addUser.model';
import { AddUserRequest } from '../../../shared/models/api_models/addUser.model';
import { ResponseModel } from 'src/app/shared/models/client_models/response.model';
import { UserService } from 'src/app/shared/services/user.service';
import { UserModel } from '../../../shared/models/client_models/user.model';

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
    // private request: RequestService
    private http: HttpClient,
    private cd: ChangeDetectorRef,
    private userService: UserService
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
    if (this.loginForm.valid) {

      try {
        this.loading = true;
        const data: GetUserRequest = {
          username: this.loginForm.get('username').value,
          password: this.loginForm.get('password').value
        };

        const resp: ResponseModel<GetUserResponse> = await this.http.post(GetUsersURL, data).toPromise();
        if (resp && resp.data && resp.data.user) {
          const user: UserModel = resp.data.user;
          this.userService.updateActiveUser(user);
          this.router.navigate(['/write-or-read']);

        } else {
          this.errorMsg = 'No se ha encontrado usuario con esa clave y contraseña. Revise los datos.';
        }
      } catch (err) {
        console.log('*** ERROR ***', err);
        this.errorMsg = 'Ha ocurrido un problema consultando su usuario. Intente mas tarde';
      }

      this.loading = false;


    } else {
      this.loginForm.markAsTouched();
      this.loginForm.get('username').markAsTouched();
      this.loginForm.get('password').markAsTouched();
    }
    this.cd.markForCheck();
  }

  async signin() {
    this.errorMsg = null;
    if (this.loginForm.valid) {

      try {
        this.loading = true;
        const data: AddUserRequest = {
          username: this.loginForm.get('username').value,
          password: this.loginForm.get('password').value
        };
        const resp: ResponseModel<AddUserResponse> = await this.http.post(AddUsersURL, data).toPromise();
        // if (resp) {
        if (resp && resp.data && resp.data.user) {
          const user: UserModel = new UserModel();
          user._id = resp.data.user._id;
          user.username = resp.data.user.username;
          user.password = resp.data.user.password;
          user.characters = resp.data.user.characters;
          user.rol = resp.data.user.rol;

          this.userService.updateActiveUser(user);

          this.router.navigate(['/write-or-read']);
        } else {
          this.errorMsg = 'Ha ocurrido un creando su usuario. Intente mas tarde';
        }
      } catch (err) {
        console.log('*** ERROR ***', err);
        this.errorMsg = 'Ha ocurrido un creando su usuario. Intente mas tarde';
      }
      this.loading = false;

    } else {
      this.loginForm.markAsTouched();
      this.loginForm.get('username').markAsTouched();
      this.loginForm.get('password').markAsTouched();
      this.loginForm.get('confirmation').markAsTouched();
    }
    this.cd.markForCheck();
  }


  checkPasswords(group: FormGroup) {
    const pass = group.controls.password.value;
    const confirmPass = group.controls.confirmation.value;

    return pass === confirmPass ? null : { notSame: true };
  }
}
