import { Component, OnInit, Input, ChangeDetectorRef, OnChanges, ElementRef, ViewChild, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { ReadFragment } from 'wos-api';
import { TextAnimation } from 'ngx-teximate';
import { rotateInDownLeft, fadeInDown, bounceInDown, bounceIn, fadeInLeft, fadeInRight } from 'ng-animate';
import { trigger, transition, useAnimation, AnimationOptions } from '@angular/animations';
import { AnimationsTypes } from '../../constants';
import { ScrollAnimationService } from '../../services/scroll-animation.service';
import { Subscription } from 'rxjs';
import { isScrollAtBottom } from '../../utils/commons';

@Component({
  selector: 'app-animated-fragment',
  templateUrl: './animated-fragment.component.html',
  styleUrls: ['./animated-fragment.component.scss'],
  animations: [
    trigger('fadeInLeft', [transition('* => *', useAnimation(fadeInLeft))]),
    trigger('fadeInRight', [transition('* => *', useAnimation(fadeInRight))]),
  ],
})
export class AnimatedFragmentComponent implements OnInit, OnChanges, OnDestroy {

  constructor(private cd: ChangeDetectorRef, private scrollService: ScrollAnimationService) { }

  @Input() tale: ReadFragment[];
  @Input() title: string;
  @Output() finish: EventEmitter<boolean> = new EventEmitter<boolean>();

  options: TextAnimation = {
    animation: bounceIn,
    delay: 10,
    type: 'paragraph'
  };
  titleOption: TextAnimation = {
    animation: bounceIn,
    delay: 70,
    type: 'letter'
  };

  shownFragments: { fragment: ReadFragment, options: TextAnimation }[] = [];


  animationsTypes = AnimationsTypes;
  skipedParagrafs = [];
  pendingIndex = null;

  atBottom = false;

  subscription: Subscription[] = [];
  scrollElement: any;

  ngOnInit() {
    this.subscription.push(
      this.scrollService.scrollAtBottom$.subscribe(bottom => {
        this.atBottom = bottom;
        if (bottom) {
          if (this.pendingIndex) {
            this.finishAnimation(this.pendingIndex);
            this.pendingIndex = null;
          }
        }
      }),
      this.scrollService.scrollElement$.subscribe(element => {
        this.scrollElement = element;
      })
    );
  }

  ngOnChanges() {
    if (this.tale && this.tale.length > 0) {
      this.startAnimation();
      this.skipedParagrafs = [];
    }
  }
  ngOnDestroy() {
    this.subscription.forEach(subs => subs.unsubscribe());
  }

  startAnimation() {
    this.shownFragments = [{ fragment: this.tale[0], options: this.getAnimationOptions(this.tale[0].animation) }];
    this.cd.markForCheck();
  }

  finishAnimation(i) {
    if (!this.scrollElement ||
      isScrollAtBottom(this.scrollElement)
    ) {
      if (this.tale[i + 1] && this.tale[i + 1].text) {
        // this.scrollService.scrollAtBottom$.next(false);
        this.shownFragments.push({
          fragment: this.tale[i + 1],
          options: this.getAnimationOptions(this.tale[i + 1].animation)
        }
        );
      } else {
        this.finish.emit(true);
      }
    } else {
      this.pendingIndex = i + 1;
    }
  }

  getAnimationOptions(animation: string): TextAnimation {
    let option: TextAnimation = {
      animation: bounceIn,
      delay: 75,
      type: 'word'
    };

    switch (animation) {
      case AnimationsTypes.chatA:
        option.animation = fadeInLeft;
        option.type = 'paragraph';
        return option;
      case AnimationsTypes.chatB:
        option.animation = fadeInRight;
        option.type = 'paragraph';
        return option;
      case AnimationsTypes.title:
        option = this.titleOption;
        return option;
      default:
        return option;
    }



  }

  skipParagraph() {
    const lastIndex = this.shownFragments.length - 1;
    this.skipedParagrafs.push(lastIndex);
    this.cd.markForCheck();

    this.finishAnimation(lastIndex);
  }


}
