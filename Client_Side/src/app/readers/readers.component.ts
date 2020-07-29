import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';
import { Store } from '@ngxs/store';
import { GetAllCities } from '../shared/store/locations/locations.actions';

@Component({
  selector: 'app-readers',
  templateUrl: './readers.component.html',
  styleUrls: ['./readers.component.scss']
})
export class ReadersComponent implements OnInit {

  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;

  constructor(private store: Store) { }

  ngOnInit() {
    this.store.dispatch(new GetAllCities({published: true, force: false}));
  }

  open() {
    this.sidenav.open();
  }

  close(reason: string) {
    this.sidenav.close();
  }

}
