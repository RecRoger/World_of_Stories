import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadChaptersComponent } from './read-chapters.component';

describe('ReadChaptersComponent', () => {
  let component: ReadChaptersComponent;
  let fixture: ComponentFixture<ReadChaptersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadChaptersComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadChaptersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
