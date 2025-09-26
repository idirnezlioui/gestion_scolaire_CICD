import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresenceSaisieComponent } from './presence-saisie.component';

describe('PresenceSaisieComponent', () => {
  let component: PresenceSaisieComponent;
  let fixture: ComponentFixture<PresenceSaisieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PresenceSaisieComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PresenceSaisieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
