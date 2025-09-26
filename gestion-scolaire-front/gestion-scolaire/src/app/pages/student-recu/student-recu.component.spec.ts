import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentRecuComponent } from './student-recu.component';

describe('StudentRecuComponent', () => {
  let component: StudentRecuComponent;
  let fixture: ComponentFixture<StudentRecuComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentRecuComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentRecuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
