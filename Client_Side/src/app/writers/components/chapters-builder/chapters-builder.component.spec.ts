import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChaptersBuilderComponent } from './chapters-builder.component';

describe('ChaptersBuilderComponent', () => {
  let component: ChaptersBuilderComponent;
  let fixture: ComponentFixture<ChaptersBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChaptersBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChaptersBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
