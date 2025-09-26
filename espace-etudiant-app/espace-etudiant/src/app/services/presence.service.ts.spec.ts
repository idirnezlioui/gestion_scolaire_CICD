import { TestBed } from '@angular/core/testing';

import { PresenceServiceTs } from './presence.service.ts';

describe('PresenceServiceTs', () => {
  let service: PresenceServiceTs;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PresenceServiceTs);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
