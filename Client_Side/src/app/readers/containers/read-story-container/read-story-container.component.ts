import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { Select, Store, Actions, ofActionSuccessful } from '@ngxs/store';
import { Character, CharacterLocation, City, Place, Npc, Chapter } from 'wos-api';
import { UserState } from 'src/app/shared/store/users/users.reducer';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { ScrollAnimationService } from 'src/app/shared/services/scroll-animation.service';
import { GetAllCities, GetAllPlaces, GetCityData, GetPlaceData } from 'src/app/shared/store/locations/locations.actions';
import { isScrollAtBottom } from 'src/app/shared/utils/commons';
import { UpdateCharacterLocation } from 'src/app/shared/store/users/users.actions';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';
import { StoriesState } from 'src/app/shared/store/stories/stories.reducer';
import { map } from 'rxjs/operators';
import { GetNpcData, GetAllNpcs, GetNpcStory, GetChapterData } from 'src/app/shared/store/stories/stories.actions';
import { ReaderTabs } from 'src/app/shared/constants';

@Component({
  selector: 'app-read-story-container',
  templateUrl: './read-story-container.component.html',
  styleUrls: ['./read-story-container.component.scss']
})
export class ReadStoryContainerComponent implements OnInit, OnDestroy {

  @Select(UserState.getCharacter) character$: Observable<Character>;
  @Select(LocationState.getCities) cities$: Observable<City[]>;
  character: Character;
  @Select(StoriesState.getNpcs) allNpcs$: Observable<any>;
  get npcs$(): Observable<Npc[]> {
    return this.allNpcs$.pipe(map(filterFn => filterFn(this.place && this.place.id)));
  }

  npcs: Npc[] = [];

  @ViewChild('scroll', { static: false }) private scrollDiv: ElementRef;

  atBottom = true;
  location: CharacterLocation = {};

  activeTab = null;

  citiesloading = false;

  cityId: string;

  
  cities: City[];
  city: City;
  place: Place;
  npc: Npc;
  chapters: Chapter[];

  subscriptions: Subscription[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router,
    private scrollService: ScrollAnimationService,
    private actions$: Actions
  ) { }

  async ngOnInit() {
    await this.getAllCities();

    this.subscriptions.push(
      this.character$.subscribe(char => {
        this.character = char;
        this.location = this.character.location;
        this.scrolling(null);

        if (!this.location || !this.location.cityId) {
          this.activeTab = ReaderTabs.start;
        } else if (!this.location.placeId && this.location.cityId) {
          this.activeTab = ReaderTabs.city;
        } else if (!this.location.npcId && this.location.placeId) {
          this.activeTab = ReaderTabs.place;
        } else if (!this.location.chapterId && this.location.npcId) {
          this.activeTab = ReaderTabs.npc;
        } else if (this.location.chapterId) {
          this.activeTab = ReaderTabs.story;
        }

      }),
      this.cities$.subscribe(async list => {
        if (this.location) {

          if (this.location.cityId) {
            const cities = list || [];
            this.city = cities.find(c => c.id === this.location.cityId);
            if (this.city && !this.city.travel) {
              this.store.dispatch(new GetCityData({ cityId: this.location.cityId }));
            }
          }

          if (this.location.placeId) {
            this.place = this.city && this.city.places && this.city.places.find(p => p.id === this.location.placeId);

            if (!this.place && this.city && this.city.travel && !this.city.places) {
              this.store.dispatch(new GetAllPlaces({ request: { cityId: this.location.cityId } }));
            }
            if (this.place && !this.place.entry) {
              this.store.dispatch(new GetPlaceData({ cityId: this.location.cityId, placeId: this.location.placeId }));
            }
          }

          if (this.location.npcId && !this.npc) {
            if (this.place && this.place.entry) {
              await this.store.dispatch(new GetAllNpcs({ placeId: this.place.id, published: false })).toPromise();
            }
          }
        }
      }),
      this.npcs$.subscribe(npcList => {
        if (this.location) {
          this.npcs = npcList || [];

          if (this.place && this.location.npcId) {
            this.npc = this.npcs.find(n => n.id === this.location.npcId);
            if (this.npc && !this.npc.meeting) {
              this.store.dispatch(new GetNpcData({ npcId: this.location.npcId, placeId: this.place.id }));
            }
          }

          if (this.npc && this.location.chapterId) {
            this.chapters = this.npc.chapters;
            if (this.npc.meeting && (!this.npc.chapters || this.npc.chapters.length === 0)) {
              this.store.dispatch(new GetNpcStory(
                {
                  placeId: this.place.id,
                  npcId: this.npc.id,
                  request: { id: this.npc.id, published: false }
                }
              ));
            }

            const specificChapter = this.chapters && this.chapters.find(c => c.id === this.location.chapterId);
            if (specificChapter && !specificChapter.story) {
              this.store.dispatch(new GetChapterData(
                {
                  placeId: this.location.placeId,
                  npcId: this.location.npcId,
                  chapterId: this.location.chapterId
                }
              ));
            }
            this.cd.markForCheck();
          }


        }
      }),
      this.actions$.pipe(ofActionSuccessful(UpdateCharacterLocation)).subscribe((action: UpdateCharacterLocation) => {
        if (!action.payload.placeId) {
          // this.store.dispatch(new GetAllPlaces({ request: { cityId: action.payload.cityId } }));
          const cities = this.store.selectSnapshot(LocationState.getCities);
          this.city = cities.find(c => c.id === this.location.cityId);
        }
        if (!action.payload.npcId) {
          // this.store.dispatch(new GetAllPlaces({ request: { cityId: action.payload.cityId } }));
          this.place = this.city.places && this.city.places.find(p => p.id === this.location.placeId);
        }
        if (!action.payload.chapterId) {
          // this.store.dispatch(new GetAllPlaces({ request: { cityId: action.payload.cityId } }));
          this.npc = this.npcs.find(n => n.id === this.location.npcId);
        }
      })
    );

  }
  // Consultar todas las ciudades
  async getAllCities() {
    this.citiesloading = true;
    this.cd.markForCheck();
    const resp = await this.store.dispatch(new GetAllCities({ published: false, force: false })).toPromise();

    this.citiesloading = false;
    this.cd.markForCheck();

  }

  ngOnDestroy() {
    this.subscriptions.forEach(subs => subs.unsubscribe());
  }

  scrolling($event) {
    const element = this.scrollDiv.nativeElement;
    this.atBottom = isScrollAtBottom(element);
    this.scrollService.scrollElement$.next(element);
    this.scrollService.scrollAtBottom$.next(this.atBottom);
  }

}
