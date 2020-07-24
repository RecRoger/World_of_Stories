import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AnimatedFragmentComponent } from './animated-fragment.component';

describe('AnimatedFragmentComponent', () => {
  let component: AnimatedFragmentComponent;
  let fixture: ComponentFixture<AnimatedFragmentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AnimatedFragmentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AnimatedFragmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
