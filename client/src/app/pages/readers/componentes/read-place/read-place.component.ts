import { Component, OnInit, OnDestroy, ViewChild, ElementRef, ChangeDetectorRef, Input, Inject } from '@angular/core';
import { Character, Place, Npc, City } from 'wos-api';
import { Select, Store } from '@ngxs/store';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { map } from 'rxjs/operators';
import { StoriesState } from 'src/app/shared/store/stories/stories.reducer';
import { faChevronRight, faChevronDown } from '@fortawesome/free-solid-svg-icons';
import { Subscription } from 'rxjs';
import { GetPlaceData, GetCityData } from 'src/app/shared/store/locations/locations.actions';
import { GetNpcData, GetAllNpcs } from 'src/app/shared/store/stories/stories.actions';
import { SetReadFragment, UpdateCharacterLocation } from 'src/app/shared/store/users/users.actions';
import { MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';

@Component({
  selector: 'app-read-place',
  templateUrl: './read-place.component.html',
  styleUrls: ['./read-place.component.scss']
})
export class ReadPlaceComponent implements OnInit, OnDestroy {


  @Select(LocationState.getPlaces) allPlaces$: Observable<any>;
  get places$(): Observable<Place[]> {
    return this.allPlaces$.pipe(map(filterFn => filterFn(this.cityId)));
  }
  @Select(UserState.getCharacter) character$: Observable<Character>;
  character: Character;

  npcs: Npc[] = [];

  @Input() cityId: string;
  @Input() placeId: string;
  city: City;
  place: Place;

  loadingPlace = false;
  loading: string[] = [];

  titleAnimationEnd = false;
  showNpcs = false;

  faDown = faChevronDown;

  subscriptions: Subscription[] = [];

  constructor(
    private store: Store,
    private cd: ChangeDetectorRef,
    private bottomSheet: MatBottomSheet
  ) { }

  async ngOnInit() {
    this.loadingPlace = true;
    await this.store.dispatch(new GetPlaceData({ placeId: this.placeId, cityId: this.cityId })).toPromise();
    this.loadingPlace = false;

    this.store.dispatch(new GetAllNpcs({ placeId: this.placeId, published: false }));
    this.subscriptions.push(
      this.places$.subscribe(list => this.place = list.find(p => p.id === this.placeId)),
      this.character$.subscribe(char => this.character = char)
    );
  }
  ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  finishEntry(fragmentId) {
    this.store.dispatch(new SetReadFragment({ fragmentId }));
    this.showNpcs = true;
    this.cd.markForCheck();
  }

  enterPlace(npcId) {
    this.store.dispatch(new UpdateCharacterLocation({ cityId: this.cityId, placeId: this.placeId, npcId }));
  }
  leavPlace() {
    this.store.dispatch(new UpdateCharacterLocation({ cityId: this.cityId, placeId: null }));
  }

  openSelection() {
    const sheet = this.bottomSheet.open(NpcSelectorComponent, {
      data: {
        placeId: this.placeId
      }
    });
    sheet.afterDismissed().subscribe((selectedNpcId: string) => {
      if (selectedNpcId) {
        if (selectedNpcId !== 'leave') {
          this.enterPlace(selectedNpcId);
        } else {
          this.leavPlace();
        }
      }
    });
  }

}



@Component({
  selector: 'app-npc-selector',
  templateUrl: 'npc-selector.component.html',
})
export class NpcSelectorComponent {
  @Select(StoriesState.getNpcs) allNpcs$: Observable<any>;
  get npcs$(): Observable<Npc[]> {
    return this.allNpcs$.pipe(map(filterFn => filterFn(this.placeId)));
  }
  @Select(UserState.getCharacter) character$: Observable<Character>;

  faDown = faChevronDown;
  faRight = faChevronRight;

  placeId: string;

  selectedNpc: Npc;
  loading = [];

  visitBtn = false;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<NpcSelectorComponent>,
    private store: Store,
    private cd: ChangeDetectorRef) {
    this.placeId = data.placeId;
  }

  async selectNpc(npcId) {
    if (!this.selectedNpc || npcId !== this.selectedNpc.id) {

      this.loading.push(npcId);
      const store = await this.store.dispatch(new GetNpcData({ placeId: this.placeId, npcId })).toPromise();
      this.visitBtn = false;
      const npcs = store.stories[this.placeId];
      const npc = npcs.find(n => n.id === npcId);
      this.selectedNpc = npc;
      this.loading = this.loading.filter(id => id !== npcId);
      this.cd.markForCheck();
    } else {
      this.selectedNpc = null;
      this.cd.markForCheck();
    }
  }


  showEnter(fragmentId) {
    this.store.dispatch(new SetReadFragment({ fragmentId }));
    this.visitBtn = true;
    this.cd.markForCheck();
  }
  enterPlace(placeId: string) {
    this.bottomSheetRef.dismiss(placeId);
  }
  leavPlace() {
    this.bottomSheetRef.dismiss('leave');
  }
}
