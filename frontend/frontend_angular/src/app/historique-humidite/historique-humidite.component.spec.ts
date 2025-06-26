import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriqueHumiditeComponent } from './historique-humidite.component';

describe('HistoriqueHumiditeComponent', () => {
  let component: HistoriqueHumiditeComponent;
  let fixture: ComponentFixture<HistoriqueHumiditeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriqueHumiditeComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HistoriqueHumiditeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
