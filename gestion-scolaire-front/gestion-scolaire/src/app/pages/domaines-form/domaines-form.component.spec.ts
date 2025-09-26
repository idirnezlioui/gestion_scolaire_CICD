import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomainesFormComponent } from './domaines-form.component';

describe('DomainesFormComponent', () => {
  let component: DomainesFormComponent;
  let fixture: ComponentFixture<DomainesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DomainesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DomainesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
