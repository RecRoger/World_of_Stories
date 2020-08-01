import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';
import { City } from 'wos-api';
import { GetCityData } from 'src/app/shared/store/locations/locations.actions';
import { MatAccordion } from '@angular/material/expansion';
import { faChevronUp, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { SetReadFragment, UpdateCharacterLocation } from 'src/app/shared/store/users/users.actions';
import { ScrollAnimationService } from 'src/app/shared/services/scroll-animation.service';
import { isScrollAtBottom } from 'src/app/shared/utils/commons';

@Component({
  selector: 'app-select-city',
  templateUrl: './select-city.component.html',
  styleUrls: ['./select-city.component.scss']
})
export class SelectCityComponent implements OnInit, OnDestroy {

  @Select(LocationState.getCities) cities$: Observable<City[]>;
  cities: City[] = [];

  loading = [];
  enterBtn = false;

  faUp = faChevronUp;
  faRight = faChevronRight;

  selectedCity: City;

  subscriptions: Subscription[] = [];
  atBottom = false;


  constructor(private store: Store, private cd: ChangeDetectorRef, private scrollService: ScrollAnimationService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.cities$.subscribe(list => {
        this.cities = list;
      }),
      this.scrollService.scrollAtBottom$.subscribe(bottom => this.atBottom = bottom)
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }

  async selectCity(cityId) {
    if (!this.selectedCity || cityId !== this.selectedCity.id) {
      this.enterBtn = false;
      this.loading.push(cityId);
      await this.store.dispatch(new GetCityData({ cityId })).toPromise();
      const city = this.cities.find(c => c.id === cityId);
      this.selectedCity = city;
      this.loading.filter(i => i !== cityId);
    } else {
      this.selectedCity = null;
      this.cd.markForCheck();
    }
  }

  showEnter(fragmentId) {

    this.store.dispatch(new SetReadFragment({ fragmentId }));

    this.enterBtn = true;
    // this.cd.markForCheck();
  }

  enterCity(cityId) {
    this.store.dispatch(new UpdateCharacterLocation({ cityId }));
  }

}
