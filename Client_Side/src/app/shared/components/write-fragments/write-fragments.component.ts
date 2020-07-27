import { Component, OnInit, Input, EventEmitter, Output, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { ReadFragment } from 'src/client-api';
import { Subscription, timer } from 'rxjs';
import { AnimationsTypes } from '../../constants';
import { faCogs } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-write-fragments',
  templateUrl: './write-fragments.component.html',
  styleUrls: ['./write-fragments.component.scss']
})
export class WriteFragmentsComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  @Input() tale: AbstractControl;
  @Input() maxSize: number;

  talesForm: FormArrayTyped<ReadFragment>;

  subscription: Subscription;

  animationsTypes = AnimationsTypes;

  faCogs = faCogs;

  ngOnInit() {

    this.talesForm = this.fb.array([]);

    this.tale.value.forEach(t => {
      this.talesForm.push(
        this.fb.group({
          text: [t.text, [Validators.required]],
          animation: [t.animation, [Validators.required]]
        })
      );
    });

    if (this.talesForm.length === 0 || this.talesForm.value.slice(-1)[0].text) {
      this.addFragmentControl();
    }

    this.subscription = this.talesForm.valueChanges.subscribe(values => {
      let toRemove = null;
      values.forEach((value, i) => {

        // si es el ultimo
        if (i === values.length - 1) {
          if (!value.text) {
            this.talesForm.controls[i].setValidators([]);
            this.talesForm.controls[i].setErrors(null);
          } else {
            this.talesForm.controls[i].setValidators([Validators.required]);
            this.addFragmentControl();
          }
        } else {
          if (!value.text) {
            toRemove = i;
          } else {
            this.talesForm.controls[i].setValidators([Validators.required]);
          }
        }


      });
      if (toRemove || toRemove === 0) {
        this.removeFragmentControl(toRemove);
      }


      const castTale = this.talesForm.value.filter(value => value.text);
      this.tale.setValue(castTale);

    });

  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  addFragmentControl() {
    if (!this.maxSize || this.talesForm.length < this.maxSize) {
      this.talesForm.push(
        this.fb.group({
          text: ['', []],
          animation: ['default', [Validators.required]]
        })
      );
    }
  }
  removeFragmentControl(index) {
    this.talesForm.removeAt(index);
    setTimeout(() => {
      this.focusOnFragment(index - 1);
    }, 100);
    // if (index + 1 !== this.talesForm.length && !this.talesForm.value[index].text) {
    // }
  }
  focusOnFragment(index) {
    const elem = document.getElementById('input-' + index);
    elem && elem.focus();
  }

  selectAnimation(index, value) {
    this.talesForm.controls[index].get('animation').setValue(value);
  }


}
