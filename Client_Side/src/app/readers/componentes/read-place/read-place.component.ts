import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { Character, Place, Npc } from 'src/client-api';
import { Select, Store } from '@ngxs/store';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { map } from 'rxjs/operators';
import { StoriesState } from 'src/app/shared/store/stories/stories.reducer';
import { faChevronUp, faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { ScrollAnimationService } from 'src/app/shared/services/scroll-animation.service';
import { GetPlaceData } from 'src/app/shared/store/locations/locations.actions';
import { GetNpcData, GetAllNpcs } from 'src/app/shared/store/stories/stories.actions';
import { SetReadFragment } from 'src/app/shared/store/users/users.actions';

@Component({
  selector: 'app-read-place',
  templateUrl: './read-place.component.html',
  styleUrls: ['./read-place.component.scss']
})
export class ReadPlaceComponent implements OnInit, OnDestroy {

  @Select(UserState.getCharacter) character$: Observable<Character>;
  @Select(LocationState.getPlaces) allPlaces$: Observable<any>;
  get places$(): Observable<Place[]> {
    return this.allPlaces$.pipe(map(filterFn => filterFn(this.cityId)));
  }
  @Select(StoriesState.getNpcs) allNpcs$: Observable<any>;
  get npcs$(): Observable<Npc[]> {
    return this.allNpcs$.pipe(map(filterFn => filterFn(this.place && this.place.id)));
  }

  @ViewChild('scroll', { static: false }) private scrollDiv: ElementRef;

  character: Character;
  cityId: string;
  place: Place;

  loading: string[] = [];

  titleAnimationEnd = false;
  showNpcs = false;
  visitBtn = false;

  faUp = faChevronUp;
  faRight = faChevronRight;

  selectedNpc: Npc;

  subscriptions: Subscription[] = [];
  atBottom = true;

  constructor(private store: Store, private cd: ChangeDetectorRef, private scrollService: ScrollAnimationService) { }

  ngOnInit() {
    this.subscriptions.push(
      this.character$.subscribe(char => {
        this.character = char;
        this.cityId = this.character.location.cityId;
      }),
      this.places$.subscribe(list => {
        const places = list;
        this.place = places.find(c => c.id === this.character.location.placeId);
        if (this.place) {
          this.store.dispatch(new GetPlaceData({ cityId: this.cityId, placeId: this.place.id }));
          this.store.dispatch(new GetAllNpcs({ placeId: this.place.id, published: false }));
        }
      }),
      this.npcs$.subscribe(list => {
        list ? list.forEach(async npc => {
          if (!npc.description) {
            this.loading.push(npc.id);
            await this.store.dispatch(
              new GetNpcData({ npcId: npc.id, placeId: this.character.location.placeId })
            ).toPromise();
            this.loading = this.loading.filter(id => id !== npc.id);
          }
        }) : null;
      }),

    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  scrollPlace($event) {
    const element = this.scrollDiv.nativeElement;
    this.atBottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    this.scrollService.scrollAtBottom$.next(element.scrollHeight - element.scrollTop === element.clientHeight);
  }

  async selectNpc(npc) {
    if (!this.selectedNpc || npc.id !== this.selectedNpc.id) {
      this.visitBtn = false;
      this.selectedNpc = npc;
      this.cd.markForCheck();
      // this.scrollDiv.nativeElement.scrollTop = 0;
      // this.scrollService.scrollElement$.next(this.scrollDiv.nativeElement);
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
    // this.store.dispatch(new UpdateCharacterLocation({ cityId: this.city.id, placeId }));
    console.log('entrar en', npcId);
  }

}