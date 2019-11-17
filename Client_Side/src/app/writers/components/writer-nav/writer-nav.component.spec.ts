import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriterNavComponent } from './writer-nav.component';

describe('WriterNavComponent', () => {
  let component: WriterNavComponent;
  let fixture: ComponentFixture<WriterNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriterNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriterNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
