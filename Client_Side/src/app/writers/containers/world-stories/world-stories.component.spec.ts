import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorldStoriesComponent } from './world-stories.component';

describe('WorldStoriesComponent', () => {
  let component: WorldStoriesComponent;
  let fixture: ComponentFixture<WorldStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorldStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorldStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
