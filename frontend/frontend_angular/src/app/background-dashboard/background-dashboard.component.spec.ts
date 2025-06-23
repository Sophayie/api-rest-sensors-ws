import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BackgroundDashboardComponent } from './background-dashboard.component';

describe('BackgroundDashboardComponent', () => {
  let component: BackgroundDashboardComponent;
  let fixture: ComponentFixture<BackgroundDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BackgroundDashboardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BackgroundDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
