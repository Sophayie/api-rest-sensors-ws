import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Accueil2Component } from './accueil2.component';

describe('Accueil2Component', () => {
  let component: Accueil2Component;
  let fixture: ComponentFixture<Accueil2Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Accueil2Component]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Accueil2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
