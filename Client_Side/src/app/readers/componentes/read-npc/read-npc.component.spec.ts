import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReadNpcComponent } from './read-npc.component';

describe('ReadNpcComponent', () => {
  let component: ReadNpcComponent;
  let fixture: ComponentFixture<ReadNpcComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReadNpcComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReadNpcComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
