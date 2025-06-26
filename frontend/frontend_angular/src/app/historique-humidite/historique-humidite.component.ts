import { Component } from '@angular/core';
import { MeasurementService } from '../measurement.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-historique-humidite',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './historique-humidite.component.html',
  styleUrls: ['./historique-humidite.component.css']
})
export class HistoriqueHumiditeComponent {
  sensorId!: string;
  historique: any[] = [];

  constructor(
    private measurementService: MeasurementService,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.sensorId = this.route.snapshot.paramMap.get('sensorId')!;
    console.log(" sensorId humidité reçu :", this.sensorId);
    this.chargerHistorique();
  }

  chargerHistorique(): void {
    this.measurementService.getMesuresParCapteur(this.sensorId).subscribe({
      next: (mesures) => {
        this.historique = mesures.map((mesure) => {
          const date = new Date(mesure.takenAt);
          const jour = String(date.getDate()).padStart(2, '0');
          const mois = String(date.getMonth() + 1).padStart(2, '0');
          const annee = date.getFullYear();
          const heure = String(date.getHours()).padStart(2, '0');
          const minute = String(date.getMinutes()).padStart(2, '0');
          const takenAtLocal = `${jour}/${mois}/${annee} à ${heure}:${minute}`;
          return { ...mesure, takenAtLocal };
        });
      },
      error: (err) => console.error('Erreur chargement historique humidité :', err)
    });
  }
}


