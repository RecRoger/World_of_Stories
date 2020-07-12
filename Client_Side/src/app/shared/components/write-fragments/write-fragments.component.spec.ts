import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteFragmentsComponent } from './write-fragments.component';

describe('WriteFragmentsComponent', () => {
  let component: WriteFragmentsComponent;
  let fixture: ComponentFixture<WriteFragmentsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteFragmentsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteFragmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
