import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { isValid } from '@core/commons';
import { NgClass } from '@angular/common';
import { LoaderComponent } from '@components/loader/loader.component';
import { catchError, delay } from 'rxjs';
import { AlertService } from '@core/services/alert.service';
import { AlertTypes } from '@core/models/constants';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';



@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
  imports: [MatInputModule, MatButtonModule, MatFormFieldModule, ReactiveFormsModule, LoaderComponent, NgClass],
})
export class UserLoginComponent {

  protected readonly fb = inject(FormBuilder)

  protected readonly authService = inject(AuthService)

  public readonly loginForm: FormGroup = this.fb.group({
    username: ['', [
      Validators.required,
    ]],
    password: ['', [
      Validators.required
    ]]
  });

  public readonly signupForm: FormGroup = this.fb.group({
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
  })


  public loading = false;

  public type: boolean = false

  private readonly router = inject(Router)

  private readonly alertService = inject(AlertService)

  public get confirmationFormErrors(): ValidationErrors {
    return this.signupForm.get('confirmation')?.errors as ValidationErrors || {}
  }

  public back() {
    this.router.navigate(['/']);
  }

  public login(): void {
    if (isValid(this.loginForm)) {
      const { username, password } = this.loginForm.value
      this.loading = true
      this.authService.login(username, password)
        .pipe(
          catchError((e) => {
            this.alertService.setError(e)
            this.loading = false
            throw e
          })
        )
        .subscribe(response => {
          this.loading = false
          if (response) { this.router.navigate(['/user/write-or-read']); }
        })
    }
  }

  async signin() {
    if (isValid(this.signupForm)) {
      if (!this.checkPasswords(this.signupForm)) {

        this.loading = true
        const { email, username, password } = this.signupForm.value
        this.authService.signIn({ email, username, password })
          .pipe(catchError((e) => {
            this.alertService.setError(e)
            this.loading = false
            throw e
          }))
          .subscribe(response => {
            this.loading = false
            if (response) {
              this.loginForm.get('username')?.setValue(this.signupForm.get('username')?.value);
              this.loginForm.get('password')?.setValue(this.signupForm.get('password')?.value);
              this.signupForm.reset();
              this.signupForm.clearValidators();
              this.alertService.setAlert('Usuario creado correctamente', AlertTypes.success)
            }

          })

      } else {
        this.signupForm?.get('confirmation')?.setErrors({ notSame: true })
      }
    }

  }

  checkPasswords(group: AbstractControl) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmation')?.value;

    return pass === confirmPass ? null : { invalid: true };
  }
}

