import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Validators } from '@angular/forms';
import { AuthService } from '@core/services/auth.service';
import { isValid } from '@core/commons';
import { AsyncPipe, NgClass } from '@angular/common';
import { LoaderComponent } from '@components/loader/loader.component';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss'],
  imports: [AsyncPipe, ReactiveFormsModule, LoaderComponent, NgClass],
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

  public loading$ = this.authService.loading$;

  public type: boolean = false    // true para signin, false para login

  private readonly router = inject(Router)

  public back() {
    this.router.navigate(['/']);
  }

  public login(): void {
    if (isValid(this.loginForm)) {
      const { username, password } = this.loginForm.value
      this.authService.login(username, password).subscribe(response => {
        this.router.navigate(['write-or-read']);
      })
    }
  }

  async signin() {
    if (isValid(this.signupForm)) {
      if (!this.checkPasswords(this.signupForm)) {

        const { email, username, password } = this.signupForm.value
        this.authService.signIn({ email, username, password }).subscribe(response => {
          if (response) {
            this.loginForm.get('username')?.setValue(this.signupForm.get('username')?.value);
            this.loginForm.get('password')?.setValue(this.signupForm.get('password')?.value);
            this.signupForm.reset();
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
function toObservable(isLoading: any) {
  throw new Error('Function not implemented.');
}

