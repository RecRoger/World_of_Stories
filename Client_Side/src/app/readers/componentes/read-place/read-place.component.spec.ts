import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadPlaceComponent } from './read-place.component';

describe('ReadPlaceComponent', () => {
  let component: ReadPlaceComponent;
  let fixture: ComponentFixture<ReadPlaceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadPlaceComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadPlaceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
