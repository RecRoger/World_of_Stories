import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PlacesBuilderComponent } from './places-builder.component';

describe('PlacesBuilderComponent', () => {
  let component: PlacesBuilderComponent;
  let fixture: ComponentFixture<PlacesBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PlacesBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PlacesBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
