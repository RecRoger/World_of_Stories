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
    return this.allNpcs$.pipe(map(filterFn => filterFn(this.placeId)));
  }

  // npcs: Npc[] = [];

  @ViewChild('scroll', { static: false }) private scrollDiv: ElementRef;

  atBottom = true;
  location: CharacterLocation = {};

  activeTab = null;

  citiesloading = false;

  cityId: string;
  placeId: string;
  npcId: string;
  chapterId: string;


  // cities: City[];
  // city: City;
  // place: Place;
  // npc: Npc;
  // chapters: Chapter[];

  subscriptions: Subscription[] = [];

  constructor(
    private cd: ChangeDetectorRef,
    private store: Store,
    private scrollService: ScrollAnimationService,
    private actions$: Actions
  ) { }

  async ngOnInit() {
    // await this.getAllCities();

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
            const city = cities.find(c => c.id === this.location.cityId);
            if (city) {
              this.cityId = city.id;

              if (this.location.placeId) {
                this.store.dispatch(new GetAllPlaces({ request: { cityId: this.location.cityId } }));
                const place = city.places && city.places.find(p => p.id === this.location.placeId);
                if (place) {
                  this.placeId = place.id;

                  if (this.location.npcId) {
                    this.store.dispatch(new GetAllNpcs({ placeId: this.location.placeId, published: false }));
                  }

                }
              }
            }
          }
        }
      }),
      this.npcs$.subscribe(npcList => {
        if (this.location) {
          if (this.placeId && this.location.npcId) {
            const npc = npcList && npcList.find(n => n.id === this.location.npcId);
            if (npc) {
              this.npcId = npc.id;

              if (this.location.chapterId && !npc.chapters) {
                this.store.dispatch(new GetNpcStory({ placeId: this.location.placeId, npcId: this.npcId, request: { id: this.npcId } }));
              }
            }
          }
        }
      }),
      this.actions$.pipe(ofActionSuccessful(UpdateCharacterLocation)).subscribe((action: UpdateCharacterLocation) => {
        if (action.payload.cityId) {
          this.cityId = action.payload.cityId;
        }
        if (action.payload.placeId) {
          this.placeId = action.payload.placeId;
        }
        if (action.payload.npcId) {
          this.npcId = action.payload.npcId;
        }
        if (action.payload.chapterId) {
          this.chapterId = action.payload.chapterId;
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
    // if (this.scrollDiv) {
    //   const element = this.scrollDiv.nativeElement;
    //   this.atBottom = isScrollAtBottom(element);
    //   this.scrollService.scrollElement$.next(element);
    //   this.scrollService.scrollAtBottom$.next(this.atBottom);
    // }
  }

}
