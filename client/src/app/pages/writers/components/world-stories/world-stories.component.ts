import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderComponent } from '@components/loader/loader.component';
import { City, Npc, Place } from '@core/api';
import { LocationsService } from '@core/services/locations.service';
import { CitiesBuilderComponent } from '@pages/writers/components/cities-builder/cities-builder.component';
import { map, take } from 'rxjs/operators';




@Component({
  selector: 'app-world-stories',
  templateUrl: './world-stories.component.html',
  styleUrls: ['./world-stories.component.scss'],
  imports: [MatIconModule, MatButtonModule, LoaderComponent, CitiesBuilderComponent]
})
export class WorldStoriesComponent implements OnInit {

  private route = inject(ActivatedRoute)
  private router = inject(Router)
  private locationsService = inject(LocationsService)

  citiesloading: boolean = false
  placesloading: boolean = false
  npcsloading: boolean = false
  chaptersloading: boolean = false

  selectedCity: City | null = null;
  selectedPlace: Place | null = null;
  selectedNpc: Npc | null = null;

  displayCityInfo = false;
  displayPlaceInfo = false;
  displayNpcInfo = false;
  displayStoryInfo = false;
  displayWriteGuideline = false;

  private readonly destroyRef = inject(DestroyRef);

  async ngOnInit() {
    await this.getAllCities();
    this.route.queryParams.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(async (queryParam: any) => {

      this.displayCityInfo = false;
      this.displayPlaceInfo = false;
      this.displayNpcInfo = false;
      this.displayStoryInfo = false;

      if (queryParam['city']) {
        // const cities = this.store.selectSnapshot(LocationState.getCities);
        // this.selectedCity = cities.find(c => c.id === queryParam['city']);
        // await this.getAllPlaces();
      } else {
        this.selectedCity = null;
        this.selectedPlace = null;
      }
      /*       
      
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
            } */
    })

  }

  // Consultar todas las ciudades
  async getAllCities() {
    this.citiesloading = true;
    this.locationsService.getAllCities(true).subscribe(_ => {
      this.citiesloading = false;
    })
  }

  // Consultar todas los lugres
  /*   async getAllPlaces() {
      this.placesloading = true;
  
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
    }
  
    async getAllNpcs() {
      this.npcsloading = true;
  
      await this.store.dispatch(new GetAllNpcs(
        {
          placeId: this.selectedPlace.id,
          published: false,
          force: false
        }
      )).toPromise();
  
      this.npcsloading = false;
    }
  
    async getNpcStory() {
      this.chaptersloading = true;
  
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
    } */


  getSelectedCity(cityId: string) {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { city: cityId }, queryParamsHandling: '' });
  }
  getSelectedPlace(placeId: string) {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { place: placeId, event: null }, queryParamsHandling: 'merge' });
  }
  getSelectedNPC(npcId: string) {
    this.router.navigate(['.'], { relativeTo: this.route, queryParams: { event: npcId }, queryParamsHandling: 'merge' });
  }

}
