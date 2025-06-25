import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-temperature',
  imports: [],
  templateUrl: './temperature.component.html',
  styleUrls: ['./temperature.component.css']
})
export class TemperatureComponent {
  @Input() sensorId!: string;

  temperature: number = 23.5;

  rafraichir() {
    this.temperature = Number((20 + Math.random() * 10).toFixed(1));
  }

  voirHistorique() {
    console.log("Affichage de l'historique des températures");
  }
}
