import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';
import { City, Place, Character } from 'wos-api';
import { faChevronUp, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { SetReadFragment, UpdateCharacterLocation } from 'src/app/shared/store/users/users.actions';
import { GetAllPlaces, GetPlaceData, GetCityData } from 'src/app/shared/store/locations/locations.actions';
import { map } from 'rxjs/operators';
import { ScrollAnimationService } from 'src/app/shared/services/scroll-animation.service';

@Component({
  selector: 'app-read-city',
  templateUrl: './read-city.component.html',
  styleUrls: ['./read-city.component.scss']
})
export class ReadCityComponent implements OnInit, OnDestroy {

  @Select(LocationState.getCities) cities$: Observable<City[]>;
  @Select(LocationState.getPlaces) allPlaces$: Observable<any>;
  @Select(UserState.getCharacter) character$: Observable<Character>;
  get places$(): Observable<Place[]> {
    return this.allPlaces$.pipe(map(filterFn => filterFn(this.city && this.city.id)));
  }

  @ViewChild('scroll', { static: false }) private scrollDiv: ElementRef;

  city: City;
  character: Character;

  loading: string[] = [];

  titleAnimationEnd = false;
  showPlaces = false;
  enterBtn = false;

  faUp = faChevronUp;
  faRight = faChevronRight;

  selectedPlace: Place;

  subscriptions: Subscription[] = [];
  atBottom = true;

  constructor(private store: Store, private cd: ChangeDetectorRef, private scrollService: ScrollAnimationService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.character$.subscribe(char => {
        this.character = char;
      }),
      this.cities$.subscribe(list => {
        const cities = list;
        this.city = cities.find(c => c.id === this.character.location.cityId);
        if (this.city) {
          this.store.dispatch(new GetCityData({ cityId: this.city.id }));
          this.store.dispatch(new GetAllPlaces({ request: { cityId: this.city.id, published: true } }));
        }
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
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  scrollCit($event) {
    const element = this.scrollDiv.nativeElement;
    this.atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    this.scrollService.scrollAtBottom$.next(element.scrollHeight - element.scrollTop === element.clientHeight);
  }

  async selectPlace(place) {
    if (!this.selectedPlace || place.id !== this.selectedPlace.id) {
      this.enterBtn = false;
      this.selectedPlace = place;
      this.cd.markForCheck();
      // this.scrollDiv.nativeElement.scrollTop = 0;
      // this.scrollService.scrollElement$.next(this.scrollDiv.nativeElement);
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

}
