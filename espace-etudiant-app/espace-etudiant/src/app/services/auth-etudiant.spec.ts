import { TestBed } from '@angular/core/testing';

import { AuthEtudiant } from './auth-etudiant';

describe('AuthEtudiant', () => {
  let service: AuthEtudiant;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthEtudiant);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
