import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WritersHomeComponent } from './writers-home.component';

describe('WritersHomeComponent', () => {
  let component: WritersHomeComponent;
  let fixture: ComponentFixture<WritersHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WritersHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WritersHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
