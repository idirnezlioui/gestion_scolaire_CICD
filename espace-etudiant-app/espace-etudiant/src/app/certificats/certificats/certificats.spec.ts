import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Certificats } from './certificats';

describe('Certificats', () => {
  let component: Certificats;
  let fixture: ComponentFixture<Certificats>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Certificats]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Certificats);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
