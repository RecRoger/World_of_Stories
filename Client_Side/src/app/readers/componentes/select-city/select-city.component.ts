import { Component, OnInit, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';
import { City } from 'src/client-api';
import { GetCityData } from 'src/app/shared/store/locations/locations.actions';
import { MatAccordion } from '@angular/material/expansion';
import { faChevronDown, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-select-city',
  templateUrl: './select-city.component.html',
  styleUrls: ['./select-city.component.scss']
})
export class SelectCityComponent implements OnInit {

  @Select(LocationState.getCities) cities$: Observable<City[]>;
  cities: City[] = [];

  panelOpenState = false;
  loading = [];
  enterBtn = false;

  faDown = faChevronDown;
  faRight = faChevronRight;

  subscriptions: Subscription[] = []

  constructor(private store: Store, private cd: ChangeDetectorRef) { }

  ngOnInit() {
    this.subscriptions.push(
      this.cities$.subscribe(list => {
        this.cities = list;
        this.cities.forEach(async city => {
          if (!city.description) {

            this.loading.push(city.id);
            await this.store.dispatch(new GetCityData({ cityId: city.id })).toPromise();
            this.loading = this.loading.filter(id => id !== city.id);
          }
        });
      })
    );
  }

  // async openCity(cityId) {
  //   this.enterBtn = false;
  //   const store = await this.store.dispatch(new GetCityData({ cityId })).toPromise();
  // }

  showEnter() {
    window.scrollTo(0, document.body.scrollHeight);
    this.enterBtn = true;
    this.cd.markForCheck();
  }

}
