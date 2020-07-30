import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';
import { City, Place, Character } from 'src/client-api';
import { faChevronUp, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { SetReadFragment } from 'src/app/shared/store/users/users.actions';
import { GetAllPlaces, GetPlaceData } from 'src/app/shared/store/locations/locations.actions';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-read-city',
  templateUrl: './read-city.component.html',
  styleUrls: ['./read-city.component.scss']
})
export class ReadCityComponent implements OnInit {

  @Select(LocationState.getCities) cities$: Observable<City[]>;
  @Select(LocationState.getPlaces) allPlaces$: Observable<any>;
  @Select(UserState.getCharacter) character$: Observable<Character>;
  get places$(): Observable<Place[]> {
    return this.allPlaces$.pipe(map(filterFn => filterFn(this.city.id)));
  }

  city: City;
  character: Character;

  // @ViewChild('scrollBottom', { static: false }) private myScrollContainer: ElementRef;

  loading: string[] = [];
  showPlaces = false;
  enterBtn = false;

  faUp = faChevronUp;
  faRight = faChevronRight;

  selectedPlace: Place;

  subscriptions: Subscription[] = [];

  constructor(private store: Store, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.subscriptions.push(
      this.character$.subscribe(char => {
        this.character = char;
      }),
      this.cities$.subscribe(list => {
        const cities = list;
        this.city = cities.find(c => c.id === this.character.location.cityId);
      }),
      this.places$.subscribe(list => {
        list ? list.forEach(async place => {
          if (!place.description) {
            this.loading.push(place.id);
            await this.store.dispatch(new GetPlaceData({ cityId: this.city.id, placeId: place.id })).toPromise();
            this.loading = this.loading.filter(id => id !== place.id);
          }
        }) : null;
      })
    );
    this.store.dispatch(new GetAllPlaces({ request: { cityId: this.city.id, published: true } }));
  }

  async selectPlace(place) {
    if (!this.selectedPlace || place.id !== this.selectedPlace.id) {
      this.enterBtn = false;
      this.selectedPlace = place;
      this.cd.markForCheck();
    } else {
      this.selectedPlace = null;
      this.cd.markForCheck();
    }
  }

  finishTravel(fragmentId) {
    this.store.dispatch(new SetReadFragment({ fragmentId }));

    // window.scrollTo(0, document.body.scrollHeight);
    this.showPlaces = true;
    this.enterBtn = false;
    this.cd.markForCheck();
  }

  showEnter(fragmentId) {
    // this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    this.store.dispatch(new SetReadFragment({ fragmentId }));

    // window.scrollTo(0, document.body.scrollHeight);
    this.enterBtn = true;
    this.cd.markForCheck();
  }

  enterPlace(placeId) {
    // this.store.dispatch(new UpdateCharacterLocation({ cityId }))
    console.log('entrar en', placeId);
  }

}
