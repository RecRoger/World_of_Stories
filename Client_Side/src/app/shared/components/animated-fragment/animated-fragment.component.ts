import { Component, OnInit, Input, ChangeDetectorRef, OnChanges, ElementRef, ViewChild, Output, EventEmitter } from '@angular/core';
import { ReadFragment } from 'src/client-api';
import { TextAnimation } from 'ngx-teximate';
import { rotateInDownLeft, fadeInDown, bounceInDown, bounceIn, fadeInLeft, fadeInRight } from 'ng-animate';
import { trigger, transition, useAnimation } from '@angular/animations';
import { AnimationsTypes } from '../../constants';

@Component({
  selector: 'app-animated-fragment',
  templateUrl: './animated-fragment.component.html',
  styleUrls: ['./animated-fragment.component.scss'],
  animations: [
    trigger('fadeInLeft', [transition('* => *', useAnimation(fadeInLeft))]),
    trigger('fadeInRight', [transition('* => *', useAnimation(fadeInRight))]),
  ],
})
export class AnimatedFragmentComponent implements OnInit, OnChanges {

  constructor(private cd: ChangeDetectorRef) { }

  @Input() tale: ReadFragment[];
  @Input() title: string;
  @Output() finish: EventEmitter<boolean> = new EventEmitter<boolean>();

  @ViewChild('scrollMe', { static: false }) private myScrollContainer: ElementRef;

  options: TextAnimation = {
    animation: bounceIn,
    delay: 10,
    type: 'letter'
  };

  shownFragments: { fragment: ReadFragment, options: TextAnimation }[] = [];

  skipedParagrafs = [];

  animationsTypes = AnimationsTypes;
  ngOnInit() {
  }

  ngOnChanges() {
    if (this.tale && this.tale.length > 0) {
      this.startAnimation();
    }
  }

  startAnimation() {
    this.shownFragments = [{ fragment: this.tale[0], options: this.options }];
    this.cd.markForCheck();
  }

  finishAnimation(i) {
    if (this.tale[i + 1]) {
      this.shownFragments.push({
        fragment: this.tale[i + 1],
        options: this.options
      }
      );
      // try {
      //   setTimeout(() => {
      //     this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      //   }, 100);
      // } catch (err) { }
    } else {
      this.finish.emit(true);
    }
  }

  skipParagraph() {
    const lastIndex = this.shownFragments.length - 1;
    if (this.shownFragments[lastIndex].fragment.animation === this.animationsTypes.default) {
      this.skipedParagrafs.push(lastIndex);
      this.cd.markForCheck();

      this.finishAnimation(lastIndex);
    }
  }


}
