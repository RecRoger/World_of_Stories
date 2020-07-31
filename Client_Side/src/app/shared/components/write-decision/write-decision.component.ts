import { Component, OnInit, ChangeDetectorRef, Input, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Decision, DeciosionOption } from 'wos-api';
import { Subscription } from 'rxjs';
import { isValid } from '../../utils/commons';
import { SubjectSubscriber } from 'rxjs/internal/Subject';

@Component({
  selector: 'app-write-decision',
  templateUrl: './write-decision.component.html',
  styleUrls: ['./write-decision.component.scss']
})
export class WriteDecisionComponent implements OnInit, OnDestroy {

  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef) { }

  @Input() npcDecisio: boolean;
  @Input() decision: AbstractControl;

  decisionForm: FormGroupTyped<Decision>;
  optionsForm: FormArrayTyped<DeciosionOption> = this.fb.array([]);

  subscription: Subscription[] = [];

  ngOnInit() {
    this.decisionForm = this.fb.group({
      decisionType: [(this.decision.value && this.decision.value.decisionType) || 'choose', [Validators.required]],
      amount: [(this.decision.value && this.decision.value.amount), [Validators.required]],
      item: [(this.decision.value && this.decision.value.item), [Validators.required]],
      options: [[], [Validators.required]]
    }) as FormGroupTyped<Decision>;


    if (this.decision.value) {

      if (this.decision.value.options && this.decision.value.options.length > 0) {
        this.decision.value.options.forEach(option => {

          this.optionsForm.push(
            this.fb.group({
              id: [option.id, []],
              name: [option.name, [Validators.required]],
              description: [option.description, [Validators.required]],
              value: [option.value, []],
              published: [option.published, []],
              removeItem: [option.removeItem, []]
            })
          );
        });
      } else {
        this.optionsForm.push(
          this.fb.group({
            id: ['', []],
            name: ['Aceptar', [Validators.required]],
            description: ['', [Validators.required]],
            value: ['', []],
            published: [false, []],
            removeItem: [false, []]
          })
        ),
          this.optionsForm.push(
            this.fb.group({
              id: ['', []],
              name: ['Cancelar', [Validators.required]],
              description: ['', [Validators.required]],
              value: ['', []],
              published: [false, []],
              removeItem: [false, []]
            })
          );
      }
    } else {
      this.optionsForm.push(
        this.fb.group({
          id: ['', []],
          name: ['Aceptar', [Validators.required]],
          description: ['', [Validators.required]],
          value: ['true', []],
          published: [false, []],
          removeItem: [false, []]
        })
      ),
        this.optionsForm.push(
          this.fb.group({
            id: ['', []],
            name: ['Cancelar', [Validators.required]],
            description: ['', [Validators.required]],
            value: ['false', []],
            published: [false, []],
            removeItem: [false, []]
          })
        );

    }

    this.subscription.push(
      this.optionsForm.valueChanges.subscribe(val => {
        let valid = true;
        this.optionsForm.controls.forEach((opForm: FormGroup) => {
          valid = valid && isValid(opForm);
        });
        if (valid) {
          this.decisionForm.get('options').setValue(val);
        }
      }),
      this.decisionForm.valueChanges.subscribe(val => {
        this.decision.setValue(val);
      })
    )

  }

  ngOnDestroy() {
    this.subscription.forEach(subs => subs.unsubscribe());
  }


}
