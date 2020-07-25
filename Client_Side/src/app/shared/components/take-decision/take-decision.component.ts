import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Decision } from 'src/client-api';
import { trigger, transition, useAnimation } from '@angular/animations';
import { slideInDown, bounceInUp, bounceIn, fadeInDown } from 'ng-animate';

@Component({
  selector: 'app-take-decision',
  templateUrl: './take-decision.component.html',
  styleUrls: ['./take-decision.component.scss'],
  animations: [
    trigger('bounceIn', [transition('* => *', useAnimation(bounceIn))]),
    trigger('fadeInDown', [transition('* => *', useAnimation(fadeInDown))]),

  ],
})
export class TakeDecisionComponent implements OnInit {

  @Input() decision: Decision;
  @Output() taken: EventEmitter<string> = new EventEmitter<string>();

  constructor() { }

  ngOnInit() {
  }

  takeDecision(id) {
    this.taken.emit(id);
  }

}
