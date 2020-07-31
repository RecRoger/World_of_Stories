import { TestBed } from '@angular/core/testing';

import { ScrollAnimationService } from './scroll-animation.service';

describe('ScrollAnimationService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ScrollAnimationService = TestBed.get(ScrollAnimationService);
    expect(service).toBeTruthy();
  });
});
