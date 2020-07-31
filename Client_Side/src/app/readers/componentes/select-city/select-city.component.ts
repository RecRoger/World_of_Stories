import { Component, OnInit, ViewChild, ChangeDetectorRef, ElementRef, OnDestroy, HostListener } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';
import { City } from 'src/client-api';
import { GetCityData } from 'src/app/shared/store/locations/locations.actions';
import { MatAccordion } from '@angular/material/expansion';
import { faChevronUp, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { SetReadFragment, UpdateCharacterLocation } from 'src/app/shared/store/users/users.actions';
import { ScrollAnimationService } from 'src/app/shared/services/scroll-animation.service';

@Component({
  selector: 'app-select-city',
  templateUrl: './select-city.component.html',
  styleUrls: ['./select-city.component.scss']
})
export class SelectCityComponent implements OnInit, OnDestroy {

  @Select(LocationState.getCities) cities$: Observable<City[]>;
  cities: City[] = [];

  @ViewChild('scroll', { static: false }) private scrollDiv: ElementRef;
  loading = [];
  enterBtn = false;

  faUp = faChevronUp;
  faRight = faChevronRight;

  selectedCity: City;

  subscriptions: Subscription[] = [];


  constructor(private store: Store, private cd: ChangeDetectorRef, private scrollService: ScrollAnimationService) { }

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
      }),
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  scrollCityDescription($event) {
    const element = this.scrollDiv.nativeElement;
    this.scrollService.scrollAtBottom$.next(element.scrollHeight - element.scrollTop === element.clientHeight);
  }

  async selectCity(city) {
    if (!this.selectedCity || city.id !== this.selectedCity.id) {
      this.enterBtn = false;
      this.selectedCity = city;
      this.scrollDiv.nativeElement.scrollTop = 0;
      this.scrollService.scrollElement$.next(this.scrollDiv.nativeElement);
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
