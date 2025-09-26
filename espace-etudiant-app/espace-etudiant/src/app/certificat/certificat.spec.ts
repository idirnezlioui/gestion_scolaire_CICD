import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Certificat } from './certificat';

describe('Certificat', () => {
  let component: Certificat;
  let fixture: ComponentFixture<Certificat>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Certificat]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Certificat);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
