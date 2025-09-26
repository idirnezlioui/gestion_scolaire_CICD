import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecialitesFormComponent } from './specialites-form.component';

describe('SpecialitesFormComponent', () => {
  let component: SpecialitesFormComponent;
  let fixture: ComponentFixture<SpecialitesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SpecialitesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SpecialitesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
