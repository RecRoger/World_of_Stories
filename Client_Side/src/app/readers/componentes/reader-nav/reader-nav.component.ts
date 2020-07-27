import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-reader-nav',
  templateUrl: './reader-nav.component.html',
  styleUrls: ['./reader-nav.component.scss']
})
export class ReaderNavComponent implements OnInit {

  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  closeEmit() {
    this.close.emit(true);
  }

}
