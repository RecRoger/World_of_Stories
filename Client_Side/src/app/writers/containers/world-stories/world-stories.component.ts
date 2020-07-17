import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { City, Place } from 'src/client-api';

@Component({
  selector: 'app-world-stories',
  templateUrl: './world-stories.component.html',
  styleUrls: ['./world-stories.component.scss']
})
export class WorldStoriesComponent implements OnInit {

  constructor(private cd: ChangeDetectorRef) { }

  selectedCity: City;
  selectedPlace: Place;
  selectedNPC;

  ngOnInit() {
  }

  getSelectedCity(city: City) {
    this.selectedCity = city;
    this.cd.markForCheck();
  }
  getSelectedPlace(place: Place) {
    this.selectedPlace = place;
    this.cd.markForCheck();
  }
  getSelectedNPC(npc) {
    this.selectedNPC = npc;
    this.cd.markForCheck();
  }

}
