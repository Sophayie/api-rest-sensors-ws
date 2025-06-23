import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HumidimetreComponent } from './humidimetre.component';

describe('HumidimetreComponent', () => {
  let component: HumidimetreComponent;
  let fixture: ComponentFixture<HumidimetreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HumidimetreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HumidimetreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
