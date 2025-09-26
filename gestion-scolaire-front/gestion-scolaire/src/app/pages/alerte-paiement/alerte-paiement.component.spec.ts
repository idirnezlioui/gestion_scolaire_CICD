import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertePaiementComponent } from './alerte-paiement.component';

describe('AlertePaiementComponent', () => {
  let component: AlertePaiementComponent;
  let fixture: ComponentFixture<AlertePaiementComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertePaiementComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertePaiementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
