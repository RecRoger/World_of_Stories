import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NpcBuilderComponent } from './npc-builder.component';

describe('NpcBuilderComponent', () => {
  let component: NpcBuilderComponent;
  let fixture: ComponentFixture<NpcBuilderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NpcBuilderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NpcBuilderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
