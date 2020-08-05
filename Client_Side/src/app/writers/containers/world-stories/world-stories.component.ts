import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { City, Place, Npc } from 'wos-api';
import { Store } from '@ngxs/store';
import { GetAllCities, GetAllPlaces } from 'src/app/shared/store/locations/locations.actions';
import { GetAllNpcs, GetNpcStory } from 'src/app/shared/store/stories/stories.actions';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { LocationState } from 'src/app/shared/store/locations/locations.reducer';
import { StoriesState } from 'src/app/shared/store/stories/stories.reducer';
import { map, take } from 'rxjs/operators';
import { faChevronLeft, faInfo } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-world-stories',
  templateUrl: './world-stories.component.html',
  styleUrls: ['./world-stories.component.scss']
})
export class WorldStoriesComponent implements OnInit, OnDestroy {

  constructor(
    private cd: ChangeDetectorRef,
    private store: Store,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  citiesloading: boolean;
  placesloading: boolean;
  npcsloading: boolean;
  chaptersloading: boolean;

  selectedCity: City;
  selectedPlace: Place;
  selectedNpc: Npc;

  displayCityInfo = false;
  displayPlaceInfo = false;
  displayNpcInfo = false;
  displayStoryInfo = false;
  displayWriteGuideline = false;

  subscription: Subscription[] = [];

  faLeft = faChevronLeft;
  faInfo = faInfo;

  async ngOnInit() {
    await this.getAllCities();
    this.subscription.push(
      this.route.queryParams.subscribe(async (queryParam: any) => {

        this.displayCityInfo = false;
        this.displayPlaceInfo = false;
        this.displayNpcInfo = false;
        this.displayStoryInfo = false;

        if (queryParam['city']) {
          const cities = this.store.selectSnapshot(LocationState.getCities);
          this.selectedCity = cities.find(c => c.id === queryParam['city']);
          await this.getAllPlaces();
        } else {
          this.selectedCity = null;
          this.selectedPlace = null;
        }

        if (queryParam['place']) {
          const auxSub = this.store.select(LocationState.getPlaces).pipe(map(filterFn => filterFn(this.selectedCity.id))).pipe(take(1))
            .subscribe(async (places) => {
              this.selectedPlace = places.find(c => c.id === queryParam['place']);
              await this.getAllNpcs();


              if (queryParam['event']) {
                const places = this.store.select(StoriesState.getNpcs).pipe(map(filterFn => filterFn(this.selectedPlace.id))).pipe(take(1))
                  .subscribe(async (npcs) => {
                    console.log(npcs);
                    this.selectedNpc = npcs.find(c => c.id === queryParam['event']);
                    await this.getNpcStory();
                  }
                  );
              } else {
                this.selectedNpc = null;
              }
            });
        } else {
          this.selectedPlace = null;
          this.selectedNpc = null;
        }

        this.cd.markForCheck();
      })
    );


  }
  ngOnDestroy() {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  // Consultar todas las ciudades
  async getAllCities() {
    this.citiesloading = true;
    this.cd.markForCheck();

    const resp = await this.store.dispatch(new GetAllCities({ published: false, force: true })).toPromise();

    this.citiesloading = false;
    this.cd.markForCheck();

  }
  // Consultar todas los lugres
  async getAllPlaces() {
    this.placesloading = true;
    this.cd.markForCheck();

    await this.store.dispatch(new GetAllPlaces(
      {
        request: {
          cityId: this.selectedCity.id,
          published: false
        },
        force: false
      }
    )).toPromise();

    this.placesloading = false;
    this.cd.markForCheck();

  }

  async getAllNpcs() {
    this.npcsloading = true;
    this.cd.markForCheck();

    await this.store.dispatch(new GetAllNpcs(
      {
        placeId: this.selectedPlace.id,
        published: false,
        force: false
      }
    )).toPromise();

    this.npcsloading = false;
    this.cd.markForCheck();
  }

  async getNpcStory() {
    this.chaptersloading = true;
    this.cd.markForCheck();

    await this.store.dispatch(new GetNpcStory(
      {
        placeId: this.selectedPlace.id,
        npcId: this.selectedNpc.id,
        request: {
          id: this.selectedNpc.id,
          published: false
        }
      }
    )).toPromise();

    this.chaptersloading = false;
    this.cd.markForCheck();
  }


  getSelectedCity(cityId: string) {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { city: cityId }, queryParamsHandling: '' });
  }
  getSelectedPlace(placeId: string) {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { place: placeId, event: null }, queryParamsHandling: 'merge' });
  }
  getSelectedNPC(npcId) {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { event: npcId }, queryParamsHandling: 'merge' });
    this.cd.markForCheck();
  }

}
