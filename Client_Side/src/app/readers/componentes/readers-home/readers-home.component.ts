import { Component, OnInit, OnDestroy } from '@angular/core';
import { User } from 'src/client-api';
import { Subscription } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { faUser, faUserPlus, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { GetCharacters, NewCharacter, DeleteCharacter } from 'src/app/shared/store/users/users.actions';
import { FormBuilder, Validators } from '@angular/forms';
import { isValid } from 'src/app/shared/utils/commons';

@Component({
  selector: 'app-readers-home',
  templateUrl: './readers-home.component.html',
  styleUrls: ['./readers-home.component.scss']
})
export class ReadersHomeComponent implements OnInit, OnDestroy {

  user: User;

  subscription: Subscription;
  @Select(UserState.getUser) $user: Observable<User>;

  faUser = faUser;
  faUserPlus = faUserPlus;
  faRight = faChevronRight;
  faTimes = faTimes;

  characterForm: FormGroup;

  constructor(
    private store: Store,
    private router: Router,
    private fb: FormBuilder) { }

  ngOnInit() {
    this.subscription = this.$user.subscribe(val => {
      this.user = val;
    });
    this.createForm();
    this.getCharacters();
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  createForm() {
    this.characterForm = this.fb.group({
      userId: [this.user.id, []],
      name: [null, [Validators.required]]
    });
  }

  async getCharacters() {
    await this.store.dispatch(new GetCharacters()).toPromise();
  }

  async createCharacter() {
    if(isValid(this.characterForm)) {
      await this.store.dispatch(new NewCharacter(this.characterForm.value)).toPromise();
      this.createForm();
    }
  }

  async deleteCharacter(id) {
    await this.store.dispatch(new DeleteCharacter({id})).toPromise();
  }

  redirectTo(url: string) {
    this.router.navigate([url]);
  }

}
