import { Component, OnInit, Input, ChangeDetectorRef, OnChanges } from '@angular/core';
import { ReadFragment } from 'src/client-api';
import { TextAnimation } from 'ngx-teximate';
import { rotateInDownLeft, fadeInDown, bounceInDown, bounceIn } from 'ng-animate';

@Component({
  selector: 'app-animated-fragment',
  templateUrl: './animated-fragment.component.html',
  styleUrls: ['./animated-fragment.component.scss']
})
export class AnimatedFragmentComponent implements OnInit, OnChanges {

  constructor(private cd: ChangeDetectorRef) { }

  @Input() tale: ReadFragment[];
  @Input() title: string;

  options: TextAnimation = {
    animation: bounceIn,
    delay: 30,
    type: 'letter'
  };

  shownFragments: { fragment: ReadFragment, options: TextAnimation }[] = [];
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
    }
  }


}
