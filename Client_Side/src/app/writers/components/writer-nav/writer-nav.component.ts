import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-writer-nav',
  templateUrl: './writer-nav.component.html',
  styleUrls: ['./writer-nav.component.scss']
})
export class WriterNavComponent implements OnInit {

  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() { }

  ngOnInit() {
  }

  closeEmit() {
    this.close.emit(true);
  }

}
