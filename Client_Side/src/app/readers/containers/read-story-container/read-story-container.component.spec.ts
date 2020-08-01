import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadStoryContainerComponent } from './read-story-container.component';

describe('ReadStoryContainerComponent', () => {
  let component: ReadStoryContainerComponent;
  let fixture: ComponentFixture<ReadStoryContainerComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadStoryContainerComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadStoryContainerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
