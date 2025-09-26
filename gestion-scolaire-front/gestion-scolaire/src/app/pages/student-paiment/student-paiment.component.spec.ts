import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentPaimentComponent } from './student-paiment.component';

describe('StudentPaimentComponent', () => {
  let component: StudentPaimentComponent;
  let fixture: ComponentFixture<StudentPaimentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StudentPaimentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StudentPaimentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
