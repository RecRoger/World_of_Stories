import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadCityComponent } from './read-city.component';

describe('ReadCityComponent', () => {
  let component: ReadCityComponent;
  let fixture: ComponentFixture<ReadCityComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadCityComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadCityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
