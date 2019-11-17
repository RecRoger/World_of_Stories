import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CitiesBuilderComponent } from './cities-builder.component';

describe('CitiesBuilderComponent', () => {
  let component: CitiesBuilderComponent;
  let fixture: ComponentFixture<CitiesBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CitiesBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CitiesBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
