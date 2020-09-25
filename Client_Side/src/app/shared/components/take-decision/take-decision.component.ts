import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Decision } from 'wos-api';
import { trigger, transition, useAnimation } from '@angular/animations';
import { slideInDown, bounceInUp, bounceIn, fadeInDown } from 'ng-animate';
import { faCaretRight } from '@fortawesome/free-solid-svg-icons';

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

  caretRigh = faCaretRight;
  constructor() { }

  ngOnInit() {
  }

  takeDecision(id) {
    this.taken.emit(id);
  }

}
