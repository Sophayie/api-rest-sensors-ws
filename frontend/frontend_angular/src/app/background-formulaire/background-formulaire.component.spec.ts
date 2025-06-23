import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundFormulaireComponent } from './background-formulaire.component';

describe('BackgroundFormulaireComponent', () => {
  let component: BackgroundFormulaireComponent;
  let fixture: ComponentFixture<BackgroundFormulaireComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundFormulaireComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundFormulaireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
