import { Component, OnInit, Input, ChangeDetectorRef, OnChanges, ElementRef, ViewChild, Output, EventEmitter, HostListener, OnDestroy } from '@angular/core';
import { ReadFragment, Decision } from 'wos-api';
import { TextAnimation } from 'ngx-teximate';
import { rotateInDownLeft, fadeInDown, bounceInDown, bounceIn, fadeInLeft, fadeInRight, zoomIn, fadeIn } from 'ng-animate';
import { trigger, transition, useAnimation, AnimationOptions } from '@angular/animations';
import { AnimationsTypes } from '../../constants';
import { ScrollAnimationService } from '../../services/scroll-animation.service';
import { Subscription } from 'rxjs';
import { isScrollAtBottom, isValid } from '../../utils/commons';
import { faLongArrowAltLeft } from '@fortawesome/free-solid-svg-icons';
import { FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-animated-fragment',
  templateUrl: './animated-fragment.component.html',
  styleUrls: ['./animated-fragment.component.scss'],
  animations: [
    trigger('fadeIn', [transition('* => *', useAnimation(fadeIn))]),
    trigger('fadeInRight', [transition('* => *', useAnimation(fadeInRight))]),
  ],
})
export class AnimatedFragmentComponent implements OnInit, OnChanges, OnDestroy {

  constructor(private cd: ChangeDetectorRef, private scrollService: ScrollAnimationService, private fb: FormBuilder) { }

  @Input() tale: ReadFragment[];
  @Input() title: string;
  @Input() chapterMode = false;
  @Input() animations = true;
  @Output() finish: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() setChapterDivision: EventEmitter<ChapterDividerModel> = new EventEmitter<ChapterDividerModel>();

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

  faLongArrow = faLongArrowAltLeft;

  completedAnimation = false;

  newDivision: ChapterDividerModel = null;

  optionForm: FormGroup;

  ngOnInit() {
    this.subscription.push(
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

    // TODO - validar que el elemento 'parragraf'+i es visible
    if (
      true
    ) {
      if (this.tale[i + 1] && this.tale[i + 1].text) {
        if (!this.shownFragments.find(frg => frg.fragment.text === this.tale[i + 1].text)) {
          this.shownFragments.push({
            fragment: this.tale[i + 1],
            options: this.getAnimationOptions(this.tale[i + 1].animation)
          });
        }
      } else {
        if (!this.completedAnimation) {
          this.completedAnimation = true;
          this.finish.emit(true);
        }
      }
    } else {
      // TODO - de no ser visible el id='parragraf'+i, poner en pending
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
      case AnimationsTypes.surprise:
        // option.delay = 35;
        option.animation = zoomIn;
        option.type = 'word';
        return option;
      case AnimationsTypes.title:
        option = this.titleOption;
        return option;
      default:
        return option;
    }



  }

  skipParagraph() {
    if (this.animations) {

      const lastIndex = this.shownFragments.length - 1;
      this.skipedParagrafs.push(lastIndex);
      this.cd.markForCheck();

      this.finishAnimation(lastIndex);
    }
  }


  addDecision(fragmentIndex: number) {
    this.newDivision = {
      splitIndex: fragmentIndex,
      previousTales: this.shownFragments.slice(0, fragmentIndex + 1).map(t => t.fragment),
      decision: {},
      nextTales: this.shownFragments.slice(fragmentIndex + 1).map(t => t.fragment),
    };
    this.optionForm = this.fb.group({
      decision: [null, [Validators.required]]
    });
    console.log('estructura de division de caps', this.newDivision);
    this.cd.markForCheck();
  }

  saveChapterDivicion(cancel?) {
    if (cancel) {
      this.newDivision = null;
      return 0;
    }
    if (isValid(this.optionForm)) {
      this.newDivision.decision = this.optionForm.get('decision').value;
      this.setChapterDivision.emit(this.newDivision);
    }
  }


}

export class ChapterDividerModel {
  splitIndex?: number;
  previousTales?: ReadFragment[];
  decision?: Decision;
  nextTales?: ReadFragment[];
}
