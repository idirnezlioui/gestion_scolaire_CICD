import { TestBed } from '@angular/core/testing';

import { ProfAffectationService } from './prof-affectation.service';

describe('ProfAffectationService', () => {
  let service: ProfAffectationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfAffectationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
