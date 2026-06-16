import { Component, OnInit, Input } from '@angular/core';

@Component({
    selector: 'app-loader',
    templateUrl: './loader.component.html',
    styleUrls: ['./loader.component.scss'],
    standalone: true
})
export class LoaderComponent implements OnInit {
  
  @Input() size = 'xs';

  constructor() { }

  ngOnInit() {
  }

}
