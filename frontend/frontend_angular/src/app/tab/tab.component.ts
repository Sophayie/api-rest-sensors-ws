import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CompteComponent } from '../compte/compte.component';
import { BackgroundDashboardComponent } from '../background-dashboard/background-dashboard.component';
import { AdministateurComponent } from '../administateur/administateur.component';
import { CapteurComponent } from '../capteur/capteur.component';


@Component({
  selector: 'app-tab',
  standalone: true,
  imports: [CommonModule, CompteComponent, BackgroundDashboardComponent, AdministateurComponent, CapteurComponent],
  templateUrl: './tab.component.html',
  styleUrls: ['./tab.component.css']
})

export class TabComponent {
  ongletActif = 'dashboard';
  isAdmin = false;

  ngOnInit(): void {
    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
  }

  changerOnglet(nom: string) {
    this.ongletActif = nom;
  }
}

