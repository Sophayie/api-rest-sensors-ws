import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeasurementService } from '../measurement.service';

@Component({
  selector: 'app-temperature',
  imports: [CommonModule],
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

  voirHistorique() {
  this.afficherHistorique = !this.afficherHistorique;
  if (this.afficherHistorique) {
    this.measurementService.getMesuresParCapteur(this.sensorId).subscribe({
      next: (mesures) => {
        this.historique = mesures.map((mesure) => {
          const dateUtc = new Date(mesure.takenAt);

          // Appliquer manuellement le décalage UTC-4
          // Montréal = UTC-4 en été (juin) ⇒ -240 minutes
          const dateMontreal = new Date(dateUtc.getTime() - (4 * 60 * 60 * 1000));

          // Format manuel
          const jour = String(dateMontreal.getDate()).padStart(2, '0');
          const mois = String(dateMontreal.getMonth() + 1).padStart(2, '0');
          const annee = dateMontreal.getFullYear();
          const heure = String(dateMontreal.getHours()).padStart(2, '0');
          const minute = String(dateMontreal.getMinutes()).padStart(2, '0');

          const takenAtLocal = `${jour}/${mois}/${annee} à ${heure}:${minute}`;

          return { ...mesure, takenAtLocal };
        });
      },
      error: (err) => {
        console.error("Erreur chargement historique :", err);
        }
      });
    }
  }

}
