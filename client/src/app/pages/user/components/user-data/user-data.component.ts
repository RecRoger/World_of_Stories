import { AfterViewInit, Component, DestroyRef, inject } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '@core/api';
import { isValid } from '@core/commons';
import { AuthService } from '@core/services/auth.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { catchError, tap } from 'rxjs';
import { AlertService } from '@core/services/alert.service';
import { AlertTypes } from '@core/models/constants';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { LoaderComponent } from '@components/loader/loader.component';
import { MatIconModule } from '@angular/material/icon';
import { AsyncPipe, NgClass } from '@angular/common';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss'],
  imports: [AsyncPipe, MatInputModule, MatButtonModule, MatFormFieldModule, MatIconModule, ReactiveFormsModule, LoaderComponent]
})
export class UserDataComponent implements AfterViewInit {

  private readonly fb = inject(FormBuilder)
  private readonly router = inject(Router)
  private readonly authService = inject(AuthService)
  private readonly alertService = inject(AlertService)
  private readonly destroyRef = inject(DestroyRef);

  public user$ = this.authService.user$.pipe(tap(user => {
    this.userForm.patchValue({ ...user })
  }))

  public userForm: FormGroup = this.fb.group({
    id: [null, [Validators.required]],
    email: [null, [Validators.required]],
    username: [null, [Validators.required]],
    password: [null, []],
    confirmation: [null, []],
  });;

  public passwordChangeIndicator = false;
  public loading = false;

  public get confirmationFormErrors(): ValidationErrors {
    return this.userForm.get('confirmation')?.errors as ValidationErrors || {}
  }

  public ngAfterViewInit(): void {
    this.userForm.get('password')?.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(val => {
        const passControl = this.userForm.get('password');
        const confirmControl = this.userForm.get('confirmation');
        if (val && passControl?.dirty) {
          confirmControl?.setValidators([Validators.required]);
          confirmControl?.setValue(null);
          // confirmControl.enable();
          this.passwordChangeIndicator = true;
        } else {
          // confirmControl.disable();
          this.passwordChangeIndicator = false;
          confirmControl?.setValidators([]);
          confirmControl?.setValue('');
        }
      })
  }



  public saveEdition(): void {
    if (isValid(this.userForm)) {
      if (!this.checkPasswords(this.userForm)) {
        this.loading = true
        const updatedUser: User = {
          id: this.userForm.get('id')?.value,
          email: this.userForm.get('email')?.value,
          username: this.userForm.get('username')?.value,
          password: this.userForm.get('password')?.value || undefined
        };
        this.authService.updateUser(updatedUser)
          .pipe(catchError(err => {
            this.alertService.setError(err)
            this.loading = false
            throw err
          }))
          .subscribe(response => {
            if (response) {
              this.loading = false
              this.alertService.setAlert('Modificacion exitosa', AlertTypes.success)
            }
          })
      } else {
        this.userForm.get('confirmation')?.setErrors({ notSame: true });
      }
    }
  }

  goBack() {
    this.router.navigate(['user/write-or-read']);
  }


  checkPasswords(group: AbstractControl) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmation')?.value;

    return pass === confirmPass ? null : true;
  }

}


