import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Attestation } from './attestation';

describe('Attestation', () => {
  let component: Attestation;
  let fixture: ComponentFixture<Attestation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Attestation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Attestation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
