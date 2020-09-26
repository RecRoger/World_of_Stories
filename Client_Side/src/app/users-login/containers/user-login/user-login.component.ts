import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectorRef } from '@angular/core';
import { Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { LoginUser, SigninUser } from 'src/app/shared/store/users/users.actions';
import { isValid } from 'src/app/shared/utils/commons';
import { RequestSignin, RequestLogin } from 'wos-api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit, OnDestroy {

  loginForm: FormGroup;
  signupForm: FormGroup;
  loading = false;
  type: boolean;    // true para signin, false para login


  constructor(
    private router: Router,
    private fb: FormBuilder,
    private store: Store,
    private cd: ChangeDetectorRef,
    private actions$: Actions,
  ) {
  }

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', [
        Validators.required,
        // Validators.email
      ]],
      password: ['', [
        Validators.required
      ]]
    });
    this.signupForm = this.fb.group({
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      username: ['', [
        Validators.required,
        // Validators.email
      ]],
      password: ['', [
        Validators.required
      ]],
      confirmation: ['', [
        Validators.required
      ]]
    });

  }
  ngOnDestroy() {
  }

  back() {
    this.router.navigate(['/']);
  }

  async login() {
    if (isValid(this.loginForm)) {

      this.loading = true;
      const loginReq: RequestLogin = {
        password: this.loginForm.value.password,
        username: this.loginForm.value.username
      };

      const state = await this.store.dispatch(new LoginUser(loginReq)).toPromise();
      if (state.user && state.user.activedUser) {
        this.router.navigate(['/user/write-or-read']);
      }
      this.loading = false;

    }
    this.cd.markForCheck();
  }

  async signin() {
    if (isValid(this.signupForm)) {

      if (!this.checkPasswords(this.signupForm)) {
        this.loading = true;

        const signReq: RequestSignin = {
          user: {
            email: this.signupForm.get('email').value,
            username: this.signupForm.get('username').value,
            password: this.signupForm.get('password').value
          }
        };
        const state = await this.store.dispatch(new SigninUser(signReq)).toPromise();

        if (state.user.signupIndicator) {
          this.loginForm.get('username').setValue(this.signupForm.get('username').value);
          this.loginForm.get('password').setValue(this.signupForm.get('password').value);
          this.signupForm.reset();
        }

        this.loading = false;

      } else {
        this.signupForm.get('confirmation').setErrors({ notSame: true })
      }

    }
    this.cd.markForCheck();
  }


  checkPasswords(group: AbstractControl) {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmation').value;

    return pass === confirmPass ? null : { invalid: true };
  }
}
