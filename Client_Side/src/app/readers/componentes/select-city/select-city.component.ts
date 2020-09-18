import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';
import { City, Character } from 'wos-api';
import { GetCityData } from 'src/app/shared/store/locations/locations.actions';
import { MatAccordion } from '@angular/material/expansion';
import { faChevronUp, faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { SetReadFragment, UpdateCharacterLocation } from 'src/app/shared/store/users/users.actions';
import { ScrollAnimationService } from 'src/app/shared/services/scroll-animation.service';
import { isScrollAtBottom } from 'src/app/shared/utils/commons';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { MatBottomSheet, MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-select-city',
  templateUrl: './select-city.component.html',
  styleUrls: ['./select-city.component.scss']
})
export class SelectCityComponent implements OnInit, OnDestroy {

  @Select(LocationState.getCities) cities$: Observable<City[]>;
  cities: City[] = [];

  faDown = faChevronDown;

  subscriptions: Subscription[] = [];

  constructor(
    private store: Store,
    private bottomSheet: MatBottomSheet
  ) { }

  ngOnInit() {
    this.subscriptions.push(
      this.cities$.subscribe(list => {
        this.cities = list;
      })
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  enterCity(cityId) {
    this.store.dispatch(new UpdateCharacterLocation({ cityId }));
  }

  openSelection() {
    const sheet = this.bottomSheet.open(CitySelectorComponent);
    sheet.afterDismissed().subscribe((selectedCityId: string) => {
      if (selectedCityId) {
        this.enterCity(selectedCityId);
      }
    });
  }

}


@Component({
  selector: 'app-city-selector',
  templateUrl: 'city-selector.component.html',
})
export class CitySelectorComponent {

  @Select(LocationState.getCities) cities$: Observable<City[]>;
  cities: City[] = [];
  @Select(UserState.getCharacter) character$: Observable<Character>;

  faDown = faChevronDown;
  faRight = faChevronRight;

  selectedCity: City;
  loading = [];

  enterBtn = false;


  constructor(private bottomSheetRef: MatBottomSheetRef<CitySelectorComponent>, private store: Store, private cd: ChangeDetectorRef) { }

  async selectCity(cityId) {
    if (!this.selectedCity || cityId !== this.selectedCity.id) {
      this.loading.push(cityId);
      const store = await this.store.dispatch(new GetCityData({ cityId })).toPromise();
      const cities = store.locations.cities;
      this.selectedCity = cities.find(c => c.id === cityId);
      this.loading = this.loading.filter(i => i !== cityId);
    } else {
      this.selectedCity = null;
    }
    this.enterBtn = false;
    this.cd.markForCheck();
  }

  showEnter(fragmentId) {
    this.store.dispatch(new SetReadFragment({ fragmentId }));
    this.enterBtn = true;
    this.cd.markForCheck();
  }
  enterCity(city: City){
    this.bottomSheetRef.dismiss(city);
  }
}
