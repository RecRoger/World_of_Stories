import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, Input, Inject } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';
import { City, Place, Character } from 'wos-api';
import { faChevronUp, faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { SetReadFragment, UpdateCharacterLocation } from 'src/app/shared/store/users/users.actions';
import { GetAllPlaces, GetPlaceData, GetCityData } from 'src/app/shared/store/locations/locations.actions';
import { map } from 'rxjs/operators';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-read-city',
  templateUrl: './read-city.component.html',
  styleUrls: ['./read-city.component.scss']
})
export class ReadCityComponent implements OnInit, OnDestroy {

  @Select(LocationState.getCities) cities$: Observable<City[]>;
  @Select(UserState.getCharacter) character$: Observable<Character>;
  character: Character;

  @Input() cityId: string;

  city: City;

  loadingCity = false;
  titleAnimationEnd = false;
  showPlaces = false;

  faDown = faChevronDown;

  subscriptions: Subscription[] = [];

  constructor(
    private store: Store,
    private cd: ChangeDetectorRef,
    private bottomSheet: MatBottomSheet
  ) { }

  async ngOnInit() {

    this.loadingCity = true;
    await this.store.dispatch(new GetCityData({ cityId: this.cityId })).toPromise();
    this.loadingCity = false;

    this.store.dispatch(new GetAllPlaces({ request: { cityId: this.cityId } }));
    this.subscriptions.push(
      this.cities$.subscribe(list => this.city = list && list.find(c => c.id === this.cityId)),
      this.character$.subscribe(char => this.character = char)
    );
  }

  ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  finishTravel(fragmentId) {
    this.store.dispatch(new SetReadFragment({ fragmentId }));
    this.showPlaces = true;

    this.cd.markForCheck();
  }

  enterPlace(placeId) {
    this.store.dispatch(new UpdateCharacterLocation({ cityId: this.city.id, placeId }));
    // console.log('entrar en', placeId);
  }
  leaveCity() {
    this.store.dispatch(new UpdateCharacterLocation({ cityId: null, placeId: null }));
  }

  openSelection() {
    const sheet = this.bottomSheet.open(PlaceSelectorComponent, {
      data: {
        cityId: this.cityId
      }
    });
    sheet.afterDismissed().subscribe((selectedPlaceId: string) => {
      if (selectedPlaceId) {
        if (selectedPlaceId !== 'leave') {
          this.enterPlace(selectedPlaceId);
        } else {
          this.leaveCity();
        }
      }
    });
  }

}

@Component({
  selector: 'app-place-selector',
  templateUrl: 'place-selector.component.html',
})
export class PlaceSelectorComponent {
  @Select(LocationState.getPlaces) allPlaces$: Observable<any>;
  get places$(): Observable<Place[]> {
    return this.allPlaces$.pipe(map(filterFn => filterFn(this.cityId)));
  }
  @Select(UserState.getCharacter) character$: Observable<Character>;

  faDown = faChevronDown;
  faRight = faChevronRight;

  cityId: string;

  selectedPlace: City;
  loading = [];

  enterBtn = false;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<PlaceSelectorComponent>,
    private store: Store,
    private cd: ChangeDetectorRef) {
      this.cityId = data.cityId;
    }

  async selectPlace(placeId) {
    if (!this.selectedPlace || placeId !== this.selectedPlace.id) {
      this.loading.push(placeId);
      const store = await this.store.dispatch(new GetPlaceData({ cityId: this.cityId, placeId })).toPromise();
      this.enterBtn = false;
      const cities = store.locations.cities;
      const city = cities.find(c => c.id === this.cityId);
      const place = city.places && city.places.find(p => p.id === placeId);
      this.selectedPlace = place;
      this.loading = this.loading.filter(id => id !== place.id);
      this.cd.markForCheck();

    } else {
      this.selectedPlace = null;
      this.cd.markForCheck();
    }
  }

  showEnter(fragmentId) {
    this.store.dispatch(new SetReadFragment({ fragmentId }));
    this.enterBtn = true;
    this.cd.markForCheck();
  }
  enterPlace(placeId: string) {
    this.bottomSheetRef.dismiss(placeId);
  }
  leaveCity() {
    this.bottomSheetRef.dismiss('leave');
  }
}
