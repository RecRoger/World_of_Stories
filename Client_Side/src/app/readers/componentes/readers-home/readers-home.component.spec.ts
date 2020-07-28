import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadersHomeComponent } from './readers-home.component';

describe('ReadersHomeComponent', () => {
  let component: ReadersHomeComponent;
  let fixture: ComponentFixture<ReadersHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadersHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadersHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
