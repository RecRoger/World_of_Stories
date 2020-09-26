import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import {faBars} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  constructor(
    private router: Router,
    private location: Location
  ) { }

  @Output() menu: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() outBtn: boolean;

  faBars = faBars;


  ngOnInit() {
  }

  getOut() {
    this.router.navigate(['/user/write-or-read']);
  }
  openMenu() {
    this.menu.emit(true);
  }

}
