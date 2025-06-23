import { Component } from '@angular/core';
import { HeaderComponent } from '../header/header.component';
import { TabComponent } from '../tab/tab.component';

@Component({
  selector: 'app-dashboard',
  imports: [HeaderComponent, TabComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
