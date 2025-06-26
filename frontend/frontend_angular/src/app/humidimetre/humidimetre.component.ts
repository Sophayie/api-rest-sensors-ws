import { AfterViewInit, Component, ElementRef, ViewChild, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeasurementService } from '../measurement.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-humidimetre',
  imports: [CommonModule,RouterModule],
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
