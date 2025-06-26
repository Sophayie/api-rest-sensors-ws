import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueTemperatureComponent } from './historique-temperature.component';

describe('HistoriqueTemperatureComponent', () => {
  let component: HistoriqueTemperatureComponent;
  let fixture: ComponentFixture<HistoriqueTemperatureComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueTemperatureComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueTemperatureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
