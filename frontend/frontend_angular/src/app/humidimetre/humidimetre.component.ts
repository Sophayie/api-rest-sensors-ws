import { AfterViewInit, Component, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeasurementService } from '../measurement.service';

@Component({
  selector: 'app-humidimetre',
  imports: [CommonModule],
  templateUrl: './humidimetre.component.html',
  styleUrls: ['./humidimetre.component.scss']
})
export class HumidimetreComponent implements AfterViewInit {
  @ViewChild('rangeInput') rangeInputRef!: ElementRef<HTMLInputElement>;
  @Input() sensorId!: string;

  valeur: number = 30;
  historique: any[] = [];
  afficherHistorique = false;

  constructor(private measurementService: MeasurementService) {}

  ngAfterViewInit(): void {
    this.rafraichir();
  }

  onInput(): void {
    const input = this.rangeInputRef.nativeElement;
    this.valeur = +input.value;
  }

  rafraichir(): void {
    this.measurementService.getLatestMeasurement(this.sensorId).subscribe({
      next: (mesure) => {
        this.valeur = mesure.value;
        if (this.rangeInputRef) {
          this.rangeInputRef.nativeElement.value = this.valeur.toString();
        }
      },
      error: (err) => {
        console.error('Erreur chargement humidité :', err);
      }
    });
  }

  voirHistorique():void {
    this.afficherHistorique = !this.afficherHistorique;
    if (this.afficherHistorique) {
      this.measurementService.getMesuresParCapteur(this.sensorId).subscribe({
        next: (mesures) => {
          this.historique = mesures.map((mesure) => {
            const dateUtc = new Date(mesure.takenAt);
            const dateMontreal = new Date(dateUtc.getTime() - 4 * 60 * 60 * 1000);

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
          console.error('Erreur chargement historique humidité :', err);
        }
      });
    }
  }

  envoyer(): void {
    this.measurementService.envoyerCommande(this.sensorId, this.valeur).subscribe({
      next: () => {
        console.log('Commande humidité envoyée :', this.valeur);
      },
      error: (err) => {
        console.error('Erreur envoi commande humidité :', err);
      }
    });
  }

}
