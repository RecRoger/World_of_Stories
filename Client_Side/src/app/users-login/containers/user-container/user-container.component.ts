import { Component, OnInit, ViewChild } from '@angular/core';
import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-user-container',
  templateUrl: './user-container.component.html',
  styleUrls: ['./user-container.component.scss']
})
export class UserContainerComponent implements OnInit {

  @ViewChild('sidenav', { static: false }) sidenav: MatSidenav;

  constructor() { }

  ngOnInit() {
  }

  close(reason: string) {
    this.sidenav.close();
  }

}
