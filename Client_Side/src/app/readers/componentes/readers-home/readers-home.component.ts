import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { User, Character } from 'wos-api';
import { Subscription } from 'rxjs';
import { Select, Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { faUser, faUserPlus, faChevronRight, faTimes } from '@fortawesome/free-solid-svg-icons';
import { Router } from '@angular/router';
import { GetCharacters, NewCharacter, DeleteCharacter, SelectCharacter, UpdateCharacterAnimations } from 'src/app/shared/store/users/users.actions';
import { FormBuilder, Validators } from '@angular/forms';
import { isValid } from 'src/app/shared/utils/commons';

@Component({
  selector: 'app-readers-home',
  templateUrl: './readers-home.component.html',
  styleUrls: ['./readers-home.component.scss']
})
export class ReadersHomeComponent implements OnInit, OnDestroy {

  user: User;

  subscription: Subscription[] = [];
  @Select(UserState.getUser) $user: Observable<User>;

  faUser = faUser;
  faUserPlus = faUserPlus;
  faRight = faChevronRight;
  faTimes = faTimes;

  characterForm: FormGroup;

  updateingAnimations = [];

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
  ) { }

  ngOnInit() {
    this.subscription.push(
      this.$user.subscribe(val => {
        this.user = val;
      })
    );
    this.createForm();
    this.getCharacters();
  }
  ngOnDestroy() {
    this.subscription.forEach(sub => { sub.unsubscribe(); });
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
    if (isValid(this.characterForm)) {
      await this.store.dispatch(new NewCharacter(this.characterForm.value)).toPromise();
      this.createForm();
    }
  }

  async updateAnimations(char: Character) {
    if (!this.updateingAnimations.includes(char.id)) {
      this.updateingAnimations.push(char.id);
      this.cd.markForCheck();
      await this.store.dispatch(new UpdateCharacterAnimations({ ...char })).toPromise();
      this.updateingAnimations = this.updateingAnimations.filter(c => c !== char.id);
      this.cd.markForCheck();
    }
  }

  async deleteCharacter(id) {
    await this.store.dispatch(new DeleteCharacter({ id })).toPromise();
  }

  async selectCharacter(character: Character) {
    await this.store.dispatch(new SelectCharacter(character)).toPromise();
  }

}
