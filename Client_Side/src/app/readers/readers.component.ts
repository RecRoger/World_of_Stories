import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Store, Actions, ofActionSuccessful, Select } from '@ngxs/store';
import { GetAllCities } from '../shared/store/locations/locations.actions';
import { Subscription } from 'rxjs';
import { SelectCharacter, UpdateCharacterLocation } from '../shared/store/users/users.actions';
import { Router } from '@angular/router';
import { UserState } from '../shared/store/users/users.reducer';
import { Character } from 'src/client-api';

@Component({
  selector: 'app-readers',
  templateUrl: './readers.component.html',
  styleUrls: ['./readers.component.scss']
})
export class ReadersComponent implements OnInit, OnDestroy {

  @Select(UserState.getCharacter) character$: Observable<Character>;
  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;

  subscriptions: Subscription[] = [];
  character: Character;

  constructor(
    private store: Store,
    private router: Router,
    private actions$: Actions) { }

  ngOnInit() {
    this.store.dispatch(new GetAllCities({ published: true, force: false }));

    this.subscriptions.push(
      this.character$.subscribe((character) => {
        this.character = character;
      }),
      this.actions$.pipe(ofActionSuccessful(SelectCharacter, UpdateCharacterLocation)).subscribe(() => {
        if (!this.character.location || !this.character.location.cityId) {
          this.router.navigate(['/readers/select']);
        } else if (!this.character.location.placeId) {
          this.router.navigate(['/readers/city']);
        }
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  open() {
    this.sidenav.open();
  }

  close(reason: string) {
    this.sidenav.close();
  }

}
