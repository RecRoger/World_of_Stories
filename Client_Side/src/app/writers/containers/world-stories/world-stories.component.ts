import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CityModel } from 'src/app/shared/models/client_models/city.model';
import { PlaceModel } from 'src/app/shared/models/client_models/place.model';
import { NpcModel } from 'src/app/shared/models/client_models/npc.model';

@Component({
  selector: 'app-world-stories',
  templateUrl: './world-stories.component.html',
  styleUrls: ['./world-stories.component.scss']
})
export class WorldStoriesComponent implements OnInit {

  constructor(private cd: ChangeDetectorRef) { }

  selectedCity: CityModel;
  selectedPlace: PlaceModel;
  selectedNPC: NpcModel;

  ngOnInit() {
  }

  getSelectedCity(city: CityModel) {
    this.selectedCity = city;
    this.cd.markForCheck();
  }
  getSelectedPlace(place: PlaceModel) {
    this.selectedPlace = place;
    this.cd.markForCheck();
  }
  getSelectedNPC(npc: NpcModel) {
    this.selectedNPC = npc;
    this.cd.markForCheck();
  }

}
