import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy, Input } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';
import { City, Place, Character } from 'wos-api';
import { faChevronUp, faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { SetReadFragment, UpdateCharacterLocation } from 'src/app/shared/store/users/users.actions';
import { GetAllPlaces, GetPlaceData, GetCityData } from 'src/app/shared/store/locations/locations.actions';
import { map } from 'rxjs/operators';
import { ScrollAnimationService } from 'src/app/shared/services/scroll-animation.service';
import { isScrollAtBottom } from 'src/app/shared/utils/commons';

@Component({
  selector: 'app-read-city',
  templateUrl: './read-city.component.html',
  styleUrls: ['./read-city.component.scss']
})
export class ReadCityComponent implements OnInit, OnDestroy {

  @Select(LocationState.getPlaces) allPlaces$: Observable<any>;
  get places$(): Observable<Place[]> {
    return this.allPlaces$.pipe(map(filterFn => filterFn(this.city && this.city.id)));
  }

  @Input() city: City;

  loading: string[] = [];

  titleAnimationEnd = false;
  showPlaces = false;
  enterBtn = false;

  faUp = faChevronUp;
  faRight = faChevronRight;
  faDown = faChevronDown;

  selectedPlace: Place;

  subscriptions: Subscription[] = [];
  atBottom = true;

  constructor(private store: Store, private cd: ChangeDetectorRef, private scrollService: ScrollAnimationService) { }

  ngOnInit() {
    
    this.store.dispatch(new GetCityData({ cityId: this.city.id }));
    this.store.dispatch(new GetAllPlaces({ request: { cityId: this.city.id } }));
    this.subscriptions.push(this.scrollService.scrollAtBottom$.subscribe(value => { this.atBottom = value; this.cd.markForCheck(); }));
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }


  async selectPlace(placeId) {
    if (!this.selectedPlace || placeId !== this.selectedPlace.id) {

      this.loading.push(placeId);
      await this.store.dispatch(new GetPlaceData({ cityId: this.city.id, placeId })).toPromise();
      this.enterBtn = false;
      const place = this.city.places && this.city.places.find(p => p.id === placeId);
      this.selectedPlace = place;
      this.loading = this.loading.filter(id => id !== place.id);
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
    // this.enterBtn = false;
    this.cd.markForCheck();
  }

  showEnter(fragmentId) {
    this.store.dispatch(new SetReadFragment({ fragmentId }));

    this.enterBtn = true;
    this.cd.markForCheck();
  }

  enterPlace(placeId) {
    this.store.dispatch(new UpdateCharacterLocation({ cityId: this.city.id, placeId }));
    // console.log('entrar en', placeId);
  }
  leaveCity() {
    this.store.dispatch(new UpdateCharacterLocation({ cityId: null, placeId: null }));
  }

}
