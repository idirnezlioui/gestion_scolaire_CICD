import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfsFormComponent } from './profs-form.component';

describe('ProfsFormComponent', () => {
  let component: ProfsFormComponent;
  let fixture: ComponentFixture<ProfsFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProfsFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfsFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
