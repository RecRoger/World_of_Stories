import { Component, Input, OnChanges, Output, EventEmitter, inject } from '@angular/core';
import { AnimationsTypes } from '../../core/models/constants';
import { Observable, timer } from 'rxjs';
import { isValid } from '../../core/commons';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Readable, UsersDecisions } from '@core/api';
import { fadeIn, fadeInRight } from '@core/animations';
import { TextAnimation } from '@core/models/text-animation.dto';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TextAnimatorComponent } from '@components/text-animator/text-animator.component';

@Component({
  selector: 'app-animated-fragment',
  templateUrl: './animated-fragment.component.html',
  styleUrls: ['./animated-fragment.component.scss'],
  animations: [fadeIn, fadeInRight],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatMenuModule,
    TextAnimatorComponent,
    ReactiveFormsModule
  ]
})
export class AnimatedFragmentComponent implements OnChanges {

  private fb = inject(FormBuilder)

  @Input() tale?: Readable[] = [];
  @Input() title: string = '';
  @Input() chapterMode = false;
  @Input() animations = false;
  @Output() finish: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() setChapterDivision: EventEmitter<ChapterDividerModel> = new EventEmitter<ChapterDividerModel>();

  options: TextAnimation = {
    animation: 'bounceIn',
    delay: 10,
    type: 'paragraph'
  };
  titleOption: TextAnimation = {
    animation: 'bounceIn',
    delay: 70,
    type: 'letter'
  };

  shownFragments: { fragment: Readable, options: TextAnimation }[] = [];

  animationsTypes = AnimationsTypes;

  pendingIndex = null;

  completedAnimation = false;

  newDivision?: ChapterDividerModel;

  optionForm?: FormGroup;

  timeCount$: Observable<number> = timer(0, 800);

  ngOnChanges() {
    this.shownFragments = []
    setTimeout(() => {
      if (this.tale && this.tale.length > 0) {
        this.startAnimation();
      }
    }, 100)
  }

  public startAnimation(): void {
    this.shownFragments = [{
      fragment: this.tale![0],
      options: this.getAnimationOptions(this.tale![0].animation || '')
    }];
  }

  public finishAnimation(i: number): void {

    // let end = document.querySelector('#parragraf' + i);
    // let visibleEnd = isInViewport(end);

    if (i !== this.shownFragments.length - 1) {
      return;
    }

    // Buscamos el próximo fragmento que queda por mostrar en tu pool de datos
    const nextFragment = this.tale![this.shownFragments.length];

    if (nextFragment) {
      // Hacemos el push tradicional
      this.shownFragments.push({
        fragment: nextFragment,
        options: this.getAnimationOptions(nextFragment.animation || '') // O la que corresponda
      });

      // Opcional: Ejecutar scroll suave hacia el div 'parragraf' + index para acompañar la lectura
    }


    function isInViewport(element: Element | null): boolean {
      if (!element) return false;
      // TODO - mejorar funcionalidad
      const rect = element.getBoundingClientRect();
      let bot = rect.bottom;
      let top = rect.top;
      if (rect.bottom < 0 && rect.top < 0) {
        return true;
      }
      return (
        top >= 0 &&
        rect.left >= 0 &&
        bot <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
      );
    }

  }

  getAnimationOptions(animation: string): TextAnimation {
    let option: TextAnimation = {
      animation: 'bounceIn',
      delay: 75,
      type: 'word'
    };

    switch (animation) {
      case AnimationsTypes.chatA:
        option.animation = 'fadeInRight';
        option.type = 'paragraph';
        return option;
      case AnimationsTypes.chatB:
        option.animation = 'fadeInLeft';
        option.type = 'paragraph';
        return option;
      case AnimationsTypes.surprise:
        // option.delay = 35;
        option.animation = 'zoomIn';
        option.type = 'word';
        return option;
      case AnimationsTypes.title:
        option = this.titleOption;
        return option;
      default:
        return option;
    }



  }


  public addDecision(fragmentIndex: number): void {
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
  }

  public saveChapterDivicion(cancel?: boolean): void {
    if (cancel) {
      this.newDivision = undefined;
      return;
    }
    if (this.optionForm && this.newDivision && isValid(this.optionForm)) {
      this.newDivision.decision = this.optionForm.get('decision')!.value;
      this.setChapterDivision.emit(this.newDivision);
    }
  }


}

export class ChapterDividerModel {
  splitIndex?: number;
  previousTales?: Readable[];
  decision?: UsersDecisions;
  nextTales?: Readable[];
}
