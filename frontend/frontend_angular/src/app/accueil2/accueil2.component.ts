
import { SerreComponent } from '../serre/serre.component';
import { HeaderComponent } from '../header/header.component';
import { BackgroundFormulaireComponent } from '../background-formulaire/background-formulaire.component';
import { FormulaireConnexionComponent } from '../formulaire-connexion/formulaire-connexion.component';
import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-accueil2',
  standalone: true,
  imports: [HeaderComponent,FormulaireConnexionComponent ,SerreComponent,BackgroundFormulaireComponent],
  templateUrl: './accueil2.component.html',
  styleUrls: ['./accueil2.component.css'],
  encapsulation: ViewEncapsulation.None,

})
export class Accueil2Component {

}
