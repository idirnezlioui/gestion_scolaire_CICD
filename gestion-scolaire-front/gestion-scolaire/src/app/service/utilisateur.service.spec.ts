import { TestBed } from '@angular/core/testing';

import { UtilisateurService } from './service/utilisateur.service';

describe('UtilisateurService', () => {
  let service: UtilisateurService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UtilisateurService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
