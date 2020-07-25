import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TakeDecisionComponent } from './take-decision.component';

describe('TakeDecisionComponent', () => {
  let component: TakeDecisionComponent;
  let fixture: ComponentFixture<TakeDecisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TakeDecisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TakeDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
