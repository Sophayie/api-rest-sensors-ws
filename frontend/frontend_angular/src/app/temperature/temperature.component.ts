import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeasurementService } from '../measurement.service';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-temperature',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.css']
})
export class TemperatureComponent {
  @Input() sensorId!: string;

  temperature: number = 23.5;
  
  constructor(private measurementService: MeasurementService) {}

  historique: any[] = [];
  afficherHistorique = false;

  ngOnInit(): void {
    this.rafraichir();
  }
  
  rafraichir() {
    this.measurementService.getLatestMeasurement(this.sensorId).subscribe({
      next: (mesure) => {
        this.temperature = mesure.value;
      },
      error: (err) => {
        console.error('Erreur chargement température :', err);
      }
    });
  }
}
