import { Component } from '@angular/core';
import { HumidimetreComponent } from '../humidimetre/humidimetre.component';
import { TemperatureComponent } from '../temperature/temperature.component';
import { LampeComponent } from '../lampe/lampe.component';

@Component({
  selector: 'app-capteur',
  imports: [HumidimetreComponent, TemperatureComponent,LampeComponent],
  templateUrl: './capteur.component.html',
  styleUrl: './capteur.component.css'
})
export class CapteurComponent {

}
