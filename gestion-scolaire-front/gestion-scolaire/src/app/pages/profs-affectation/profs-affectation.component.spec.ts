import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfsAffectationComponent } from './profs-affectation.component';

describe('ProfsAffectationComponent', () => {
  let component: ProfsAffectationComponent;
  let fixture: ComponentFixture<ProfsAffectationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfsAffectationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfsAffectationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
