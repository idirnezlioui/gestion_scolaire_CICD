import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModulesFormComponent } from './modules-form.component';

describe('ModulesFormComponent', () => {
  let component: ModulesFormComponent;
  let fixture: ComponentFixture<ModulesFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModulesFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ModulesFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
