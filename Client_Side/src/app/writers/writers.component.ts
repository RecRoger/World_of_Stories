import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-writers',
  templateUrl: './writers.component.html',
  styleUrls: ['./writers.component.scss']
})
export class WritersComponent implements OnInit {

  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;

  constructor() { }

  ngOnInit() {
  }

  close(reason: string) {
    this.sidenav.close();
  }

}
