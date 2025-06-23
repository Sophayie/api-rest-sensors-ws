import { Routes } from '@angular/router';
import { Accueil2Component } from './accueil2/accueil2.component';
import { AccueilComponent } from './accueil/accueil.component';
import { DashboardComponent } from './dashboard/dashboard.component';

export const routes: Routes = [
    { path: '', component: Accueil2Component }, 
    { path: 'accueil', component: AccueilComponent },
    { path: 'dashboard', component: DashboardComponent }
];
