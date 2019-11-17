import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WriteOrReadComponent } from './write-or-read.component';

describe('WriteOrReadComponent', () => {
  let component: WriteOrReadComponent;
  let fixture: ComponentFixture<WriteOrReadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WriteOrReadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WriteOrReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
