import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NiveauxFormComponent } from './niveaux-form.component';

describe('NiveauxFormComponent', () => {
  let component: NiveauxFormComponent;
  let fixture: ComponentFixture<NiveauxFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NiveauxFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NiveauxFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
