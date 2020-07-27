import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-readers',
  templateUrl: './readers.component.html',
  styleUrls: ['./readers.component.scss']
})
export class ReadersComponent implements OnInit {

  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;

  constructor() { }

  ngOnInit() {
  }

  open() {
    this.sidenav.open();
  }

  close(reason: string) {
    this.sidenav.close();
  }

}
