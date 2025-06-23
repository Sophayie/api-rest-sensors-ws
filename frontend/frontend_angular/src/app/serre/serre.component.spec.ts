import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SerreComponent } from './serre.component';

describe('SerreComponent', () => {
  let component: SerreComponent;
  let fixture: ComponentFixture<SerreComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SerreComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SerreComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
