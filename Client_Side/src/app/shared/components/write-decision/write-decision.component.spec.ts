import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteDecisionComponent } from './write-decision.component';

describe('WriteDecisionComponent', () => {
  let component: WriteDecisionComponent;
  let fixture: ComponentFixture<WriteDecisionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteDecisionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteDecisionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
