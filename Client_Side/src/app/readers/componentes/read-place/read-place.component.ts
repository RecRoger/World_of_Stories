import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, Input } from '@angular/core';
import { Character, Place, Npc, City } from 'wos-api';
import { Select, Store } from '@ngxs/store';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { map } from 'rxjs/operators';
import { StoriesState } from 'src/app/shared/store/stories/stories.reducer';
import { faChevronUp, faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ScrollAnimationService } from 'src/app/shared/services/scroll-animation.service';
import { GetPlaceData, GetCityData } from 'src/app/shared/store/locations/locations.actions';
import { GetNpcData, GetAllNpcs } from 'src/app/shared/store/stories/stories.actions';
import { SetReadFragment, UpdateCharacterLocation } from 'src/app/shared/store/users/users.actions';
import { isScrollAtBottom } from 'src/app/shared/utils/commons';

@Component({
  selector: 'app-read-place',
  templateUrl: './read-place.component.html',
  styleUrls: ['./read-place.component.scss']
})
export class ReadPlaceComponent implements OnInit, OnDestroy {


  @Select(LocationState.getPlaces) allPlaces$: Observable<any>;
  get places$(): Observable<Place[]> {
    return this.allPlaces$.pipe(map(filterFn => filterFn(this.city.id)));
  }

  @Select(StoriesState.getNpcs) allNpcs$: Observable<any>;
  get npcs$(): Observable<Npc[]> {
    return this.allNpcs$.pipe(map(filterFn => filterFn(this.place && this.place.id)));
  }
  npcs: Npc[] = [];

  @Input() city: City;
  @Input() place: Place;

  loading: string[] = [];

  titleAnimationEnd = false;
  showNpcs = false;
  visitBtn = false;

  faUp = faChevronUp;
  faDown = faChevronDown;
  faRight = faChevronRight;

  selectedNpc: Npc;

  subscriptions: Subscription[] = [];
  atBottom = true;

  constructor(private store: Store, private cd: ChangeDetectorRef, private scrollService: ScrollAnimationService) { }

  ngOnInit() {
    this.store.dispatch(new GetPlaceData({ placeId: this.place.id, cityId: this.city.id }));
    this.store.dispatch(new GetAllNpcs({ placeId: this.place.id, published: false }));
    this.subscriptions.push(
      this.scrollService.scrollAtBottom$.subscribe(value => { this.atBottom = value; this.cd.markForCheck(); }),
      this.npcs$.subscribe(n => this.npcs = n)
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  async selectNpc(npcId) {
    if (!this.selectedNpc || npcId !== this.selectedNpc.id) {

      this.loading.push(npcId);
      await this.store.dispatch(new GetNpcData({ placeId: this.place.id, npcId })).toPromise();

      this.visitBtn = false;
      const npc = this.npcs.find(n => n.id === npcId);
      this.selectedNpc = npc;
      this.loading = this.loading.filter(id => id !== npcId);
      this.cd.markForCheck();


    } else {
      this.selectedNpc = null;
      this.cd.markForCheck();
    }
  }

  finishEntry(fragmentId) {
    this.store.dispatch(new SetReadFragment({ fragmentId }));

    // window.scrollTo(0, document.body.scrollHeight);
    this.showNpcs = true;
    // this.enterBtn = false;
    this.cd.markForCheck();
  }

  showEnter(fragmentId) {
    this.store.dispatch(new SetReadFragment({ fragmentId }));

    this.visitBtn = true;
    this.cd.markForCheck();
  }

  enterPlace(npcId) {
    this.store.dispatch(new UpdateCharacterLocation({ cityId: this.city.id, placeId: this.place.id, npcId }));
    // console.log('entrar en', npcId);
  }
  leavPlace() {
    this.store.dispatch(new UpdateCharacterLocation({ cityId: this.city.id, placeId: null }));
  }

}