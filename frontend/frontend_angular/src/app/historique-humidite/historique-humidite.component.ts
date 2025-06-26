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
          const dateUtc = new Date(mesure.takenAt);
          const dateMontreal = new Date(dateUtc.getTime() - 4 * 60 * 60 * 1000); // <-- ajouter ceci

          const jour = String(dateMontreal.getDate()).padStart(2, '0');
          const mois = String(dateMontreal.getMonth() + 1).padStart(2, '0');
          const annee = dateMontreal.getFullYear();
          const heure = String(dateMontreal.getHours()).padStart(2, '0');
          const minute = String(dateMontreal.getMinutes()).padStart(2, '0');
          const takenAtLocal = `${jour}/${mois}/${annee} à ${heure}:${minute}`;
          return { ...mesure, takenAtLocal };
        });
      },
      error: (err) => console.error('Erreur chargement historique humidité :', err)
    });
  }
}


