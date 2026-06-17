import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Store, Actions, ofActionSuccessful, Select } from '@ngxs/store';
import { GetAllCities } from '../../../../../Client_Side/src/app/shared/store/locations/locations.actions';
import { Subscription } from 'rxjs';
import { SelectCharacter } from '../../../../../Client_Side/src/app/shared/store/users/users.actions';
import { Router } from '@angular/router';
import { UserState } from '../../../../../Client_Side/src/app/shared/store/users/users.reducer';
import { Character } from 'wos-api';

@Component({
  selector: 'app-readers',
  templateUrl: './readers.component.html',
  styleUrls: ['./readers.component.scss'],
  standalone: true
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
    this.store.dispatch(new GetAllCities({ published: false, force: false }));

    this.subscriptions.push(
      this.character$.subscribe((character) => {
        this.character = character;
      }),
      this.actions$.pipe(ofActionSuccessful(SelectCharacter)).subscribe(() => {
        this.router.navigate(['/readers/story']);
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
