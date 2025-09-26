import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentFicheComponent } from './student-fiche.component';

describe('StudentFicheComponent', () => {
  let component: StudentFicheComponent;
  let fixture: ComponentFixture<StudentFicheComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentFicheComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentFicheComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
