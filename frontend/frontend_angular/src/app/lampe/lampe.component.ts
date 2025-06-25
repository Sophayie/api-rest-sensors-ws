import { Component, Input, OnInit } from '@angular/core';
import { MeasurementService } from '../measurement.service';

@Component({
  selector: 'app-lampe',
  templateUrl: './lampe.component.html',
  styleUrls: ['./lampe.component.css']
})
export class LampeComponent implements OnInit {
  @Input() sensorId!: string;
  etatLampe: boolean = false;

  constructor(private measurementService: MeasurementService) { }

  ngOnInit(): void {
    console.log("sensorId reçu pour la lampe :", this.sensorId);
    this.chargerEtatLampe();


  }

  chargerEtatLampe() {
    this.measurementService.getLatestMeasurement(this.sensorId).subscribe({
      next: (mesure: any) => {
        this.etatLampe = mesure.valeur === 1;
      },
      error: (err: any) => {
        console.error('Erreur de bascule lampe :', err);
      }

    });
  }
  toggleLampe() {
    const nouvelleValeur = this.etatLampe ? 0 : 1;

    this.measurementService.envoyerCommande(this.sensorId, nouvelleValeur).subscribe({
      next: () => {
        this.etatLampe = !this.etatLampe;
      },
      error: (err) => {
        console.error("Erreur lors de l'envoi de la commande :", err);
      }
    });
  }
}
