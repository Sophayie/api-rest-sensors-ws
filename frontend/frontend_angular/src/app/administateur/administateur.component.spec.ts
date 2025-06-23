import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdministateurComponent } from './administateur.component';

describe('AdministateurComponent', () => {
  let component: AdministateurComponent;
  let fixture: ComponentFixture<AdministateurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdministateurComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdministateurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
