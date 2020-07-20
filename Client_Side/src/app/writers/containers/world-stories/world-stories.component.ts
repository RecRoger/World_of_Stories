import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { City, Place } from 'src/client-api';
import { Store } from '@ngxs/store';
import { GetAllCities, GetAllPlaces } from 'src/app/shared/store/locations/locations.actions';
import { GetAllNpcs } from 'src/app/shared/store/stories/stories.actions';

@Component({
  selector: 'app-world-stories',
  templateUrl: './world-stories.component.html',
  styleUrls: ['./world-stories.component.scss']
})
export class WorldStoriesComponent implements OnInit {

  constructor(private cd: ChangeDetectorRef, private store: Store) { }

  citiesloading: boolean;
  placesloading: boolean;
  npcsloading: boolean;

  selectedCity: City;
  selectedPlace: Place;
  selectedNPC;

  ngOnInit() {
    this.getAllCities();
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

    this.store.dispatch(new GetAllPlaces(
      {
        request: {
          cityId: this.selectedCity.id,
          published: false
        },
        force: false
      }
    ));

    this.placesloading = false;
    this.cd.markForCheck();

  }

  async getAllNpcs() {
    this.npcsloading = true;
    this.cd.markForCheck();

    this.store.dispatch(new GetAllNpcs(
      {
        placeId: this.selectedPlace.id,
        published: false,
        force: false
      }
    ));

    this.npcsloading = false;
    this.cd.markForCheck();
  }


  getSelectedCity(city: City) {
    this.selectedCity = city;
    if (city) {
      this.getAllPlaces();
    }
    this.cd.markForCheck();
  }
  getSelectedPlace(place: Place) {
    this.selectedPlace = place;
    if (place) {
      this.getAllNpcs();
    }
    this.cd.markForCheck();
  }
  getSelectedNPC(npc) {
    this.selectedNPC = npc;
    this.cd.markForCheck();
  }

}
