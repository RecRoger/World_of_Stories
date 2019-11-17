import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

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

  @Input() backBtn: boolean;




  ngOnInit() {
  }

  getOut() {
    this.router.navigate(['/']);
  }
  goBack() {
    this.location.back();
  }

}
