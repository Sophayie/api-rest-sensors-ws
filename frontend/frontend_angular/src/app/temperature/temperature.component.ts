import { Component } from '@angular/core';

@Component({
  selector: 'app-temperature',
  imports: [],
  templateUrl: './temperature.component.html',
  styleUrl: './temperature.component.css'
})
export class TemperatureComponent {

  temperature: number = 23.5;

  rafraichir() {
    // Simuler une nouvelle valeur
    this.temperature = Number((20 + Math.random() * 10).toFixed(1));
  }

  voirHistorique() {
    // Affiche un tableau ou redirige vers un graphique
    console.log("Affichage de l'historique des températures");
  }

}
