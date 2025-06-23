import { Component } from '@angular/core';
import { FormulaireInscriptionComponent } from '../formulaire-inscription/formulaire-inscription.component';
import { SerreComponent } from '../serre/serre.component';
import { HeaderComponent } from '../header/header.component';
import { BackgroundFormulaireComponent } from '../background-formulaire/background-formulaire.component';

@Component({
  selector: 'app-accueil',
  imports: [HeaderComponent, FormulaireInscriptionComponent,SerreComponent,BackgroundFormulaireComponent],
  templateUrl: './accueil.component.html',
  styleUrl: './accueil.component.css'
})
export class AccueilComponent {

}
