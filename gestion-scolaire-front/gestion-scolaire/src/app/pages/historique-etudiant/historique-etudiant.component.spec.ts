import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueEtudiantComponent } from './historique-etudiant.component';

describe('HistoriqueEtudiantComponent', () => {
  let component: HistoriqueEtudiantComponent;
  let fixture: ComponentFixture<HistoriqueEtudiantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueEtudiantComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueEtudiantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
