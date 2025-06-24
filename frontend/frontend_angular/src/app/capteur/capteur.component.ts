import { Component, OnInit } from '@angular/core';
import { HumidimetreComponent } from '../humidimetre/humidimetre.component';
import { TemperatureComponent } from '../temperature/temperature.component';
import { LampeComponent } from '../lampe/lampe.component';
import { UserService } from '../user.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SensorService } from '../sensor.services';


@Component({
  selector: 'app-capteur',
  imports: [HumidimetreComponent, TemperatureComponent, LampeComponent, CommonModule, FormsModule],
  templateUrl: './capteur.component.html',
  styleUrl: './capteur.component.css'
})
export class CapteurComponent implements OnInit {
  userId: string = '';
  nomSerre: string = '';
  nouveauNom: string = '';
  messageNom: string = '';

  constructor(
    private userService: UserService,
    private sensorService: SensorService
  ) { }

  capteurs: any[] = [];
  isAdmin: boolean = false;

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      const payload = JSON.parse(atob(token.split('.')[1]));
      this.userId = payload.userId;
      this.isAdmin = payload.isAdmin || false;

      this.userService.getUserById(this.userId).subscribe({
        next: (user) => {
          this.nomSerre = user.serre?.nom || '–';
        },
        error: () => {
          this.messageNom = "Erreur lors du chargement du nom.";
        }
      });
    }
    this.sensorService.getSensorsByUser(this.userId).subscribe({
      next: (capteurs) => {
        this.capteurs = capteurs;
      },
      error: () => {
        console.error("Erreur lors du chargement des capteurs.");
      }
    });
  }


  modifierNomCapteur(): void {
    if (!this.nouveauNom.trim()) {
      this.messageNom = "Le nom ne peut pas être vide.";
      return;
    }

    this.userService.updateUser(this.userId, {
      serre: { nom: this.nouveauNom }
    }).subscribe({
      next: () => {
        // Recharge depuis le backend après update
        this.userService.getUserById(this.userId).subscribe({
          next: (user) => {
            this.nomSerre = user.serre?.nom || '–';
            this.messageNom = "Nom modifié avec succès.";
            this.nouveauNom = '';
          },
          error: () => {
            this.messageNom = "Erreur lors du rechargement du nom.";
          }
        });
      },
      error: () => {
        this.messageNom = "Erreur lors de la modification.";
      }
    });
  }
  aCapteurDeType(type: string): boolean {
    return this.capteurs.some(c => c.type === type);
  }
}
