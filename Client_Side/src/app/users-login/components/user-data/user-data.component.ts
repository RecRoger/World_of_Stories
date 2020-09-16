import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngxs/store';
import { Subscription } from 'rxjs';
import { UpdateUser } from 'src/app/shared/store/users/users.actions';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { isValid } from 'src/app/shared/utils/commons';
import { User, RequestUpdateUser } from 'wos-api';

@Component({
  selector: 'app-user-data',
  templateUrl: './user-data.component.html',
  styleUrls: ['./user-data.component.scss']
})
export class UserDataComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private store: Store, private router: Router) { }

  userForm: FormGroup;
  passwordChangeIndicator = false;

  subscriptions: Subscription[] = [];

  async ngOnInit() {
    const user: User = this.store.selectSnapshot(UserState.getUser);

    this.userForm = this.fb.group({
      id: [user.id, [Validators.required]],
      email: [user.email, [Validators.required]],
      username: [user.username, [Validators.required]],
      password: [user.password, [Validators.required]],
      confirmation: [user.password, []],
      // rol: [user.rol, []]
    });
    this.userForm.get('confirmation').disable();

    this.subscriptions.push(
      this.userForm.get('password').valueChanges.subscribe(val => {
        const confirm = this.userForm.get('confirmation');
        if (val !== user.password) {
          confirm.setValidators([Validators.required]);
          confirm.setValue(null);
          confirm.enable();
          this.passwordChangeIndicator = true;
        } else {
          confirm.disable();
          this.passwordChangeIndicator = false;
          confirm.setValidators(null);
          confirm.setValue(user.password);
        }
      })
    )
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }


  async saveEdition() {
    if (isValid(this.userForm)) {
      if (!this.checkPasswords(this.userForm)) {
        const updateReq: RequestUpdateUser = {
          user: {
            id: this.userForm.get('id').value,
            email: this.userForm.get('email').value,
            username: this.userForm.get('username').value,
            password: this.userForm.get('password').value
          }
        };
        const state = await this.store.dispatch(new UpdateUser(updateReq)).toPromise();


      } else {
        this.userForm.get('confirmation').setErrors({ notSame: true });
      }
    }
  }

  goBack() {
    this.router.navigate(['user/write-or-read']);
  }


  checkPasswords(group: AbstractControl) {
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmation').value;

    return pass === confirmPass ? null : true;
  }

}
