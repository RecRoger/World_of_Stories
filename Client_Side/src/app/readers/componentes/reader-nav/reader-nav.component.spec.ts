import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReaderNavComponent } from './reader-nav.component';

describe('ReaderNavComponent', () => {
  let component: ReaderNavComponent;
  let fixture: ComponentFixture<ReaderNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReaderNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReaderNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
