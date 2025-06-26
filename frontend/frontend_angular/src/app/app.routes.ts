import { Routes } from '@angular/router';
import { Accueil2Component } from './accueil2/accueil2.component';
import { AccueilComponent } from './accueil/accueil.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HistoriqueTemperatureComponent } from './historique-temperature/historique-temperature.component';
import { HistoriqueHumiditeComponent } from './historique-humidite/historique-humidite.component';

export const routes: Routes = [
    { path: '', component: Accueil2Component },
    { path: 'accueil', component: AccueilComponent },
    { path: 'dashboard', component: DashboardComponent },
    {
        path: 'historiqueTemperature/:sensorId',
        component: HistoriqueTemperatureComponent
    },
    { path: 'historiqueHumidite/:sensorId', component: HistoriqueHumiditeComponent }
];
