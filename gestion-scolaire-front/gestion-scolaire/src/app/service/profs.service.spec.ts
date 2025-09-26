import { TestBed } from '@angular/core/testing';

import { ProfsService } from './profs.service';

describe('ProfsService', () => {
  let service: ProfsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProfsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
