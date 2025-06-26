import { Component, OnInit } from '@angular/core';
import { UserService } from '../user.service';
import { SensorService } from '../sensor.services';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MeasurementService } from '../measurement.service';

@Component({
  selector: 'app-administateur',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './administateur.component.html',
  styleUrls: ['./administateur.component.css']
})
export class AdministateurComponent implements OnInit {
  nouvelUtilisateur = { firstName: '', lastName: '', email: '', motdepasse: '' };
  utilisateurs: any[] = [];
  editeEnCours: string | null = null;
  editeSerreId: string | null = null;
  capteursParUtilisateur: { [userId: string]: any[] } = {};

  constructor(
    private userService: UserService,
    private sensorService: SensorService,
    private measurementService: MeasurementService // ← ajoute ceci
  ) { }
  afficherTout = false;


  ngOnInit(): void {
    this.chargerUtilisateurs();
    this.chargerMesures(); 
  }

  chargerUtilisateurs(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => {
        const utilisateursAvecSerre = data.map((u: any, index: number) => ({
          ...u,
          serre: u.serre || { nom: `Serre ${String.fromCharCode(65 + index)}` }
        }));

        this.utilisateurs = utilisateursAvecSerre;
        localStorage.setItem('donneesUtilisateurs', JSON.stringify(utilisateursAvecSerre));

        for (const utilisateur of utilisateursAvecSerre) {
          this.sensorService.getSensorsByUser(utilisateur._id).subscribe({
            next: (capteurs: any[]) => {
              this.capteursParUtilisateur[utilisateur._id] = capteurs;

              for (const capteur of capteurs) {
                if (capteur.type === 'led') {
                  this.measurementService.getLatestMeasurement(capteur._id).subscribe({
                    next: (mesure) => {
                      capteur.etat = mesure.value === 1;
                    },
                    error: (err) => {
                      console.error(`Erreur récupération état LED pour ${capteur._id}`, err);
                    }
                  });
                }
              }
            },
            error: (err: any) => {
              console.error(`Erreur lors du chargement des capteurs pour ${utilisateur.firstName}`, err);
            }
          });
        }
      },
      error: (err) => {
        console.error('Erreur lors du chargement des utilisateurs :', err);
        alert('Impossible de charger les utilisateurs.');
      }
    });
  }
  ajouterUtilisateur(): void {
    const index = this.utilisateurs.length;
    const nomSerre = `Serre ${String.fromCharCode(65 + index)}`;

    const utilisateurAvecSerre = {
      ...this.nouvelUtilisateur,
      serre: { nom: nomSerre }
    };

    this.userService.createUser(utilisateurAvecSerre).subscribe({
      next: () => {
        this.chargerUtilisateurs(); // recharge à jour
        this.nouvelUtilisateur = { firstName: '', lastName: '', email: '', motdepasse: '' };
        alert('Utilisateur créé avec succès !');
      },
      error: (err) => {
        alert('Erreur lors de la création : ' + err.error.message);
        console.error('Erreur création utilisateur :', err);
      }
    });
  }

  supprimerUtilisateur(utilisateur: any): void {
    if (!confirm(`Supprimer ${utilisateur.firstName} ${utilisateur.lastName} ?`)) return;
    this.userService.deleteUser(utilisateur._id).subscribe({
      next: () => {
        this.utilisateurs = this.utilisateurs.filter(u => u._id !== utilisateur._id);
        alert('Utilisateur supprimé');
      },
      error: (err) => {
        alert('Erreur lors de la suppression : ' + (err?.error?.message || 'Erreur inconnue'));
      }
    });
  }

  activerEdition(id: string) {
    this.editeEnCours = id;
  }

  annulerEdition() {
    this.editeEnCours = null;
  }

  validerEdition(utilisateur: any) {
    const payload = {
      firstName: utilisateur.firstName,
      lastName: utilisateur.lastName,
      email: utilisateur.email
    };

    this.userService.updateUser(utilisateur._id, payload).subscribe({
      next: () => {
        this.editeEnCours = null;
        alert("Utilisateur modifié avec succès !");
      },
      error: (err) => {
        console.error(err);
        alert("Erreur lors de la modification.");
      }
    });
  }

  activerEditionSerre(id: string) {
    this.editeSerreId = id;
  }

  annulerEditionSerre() {
    this.editeSerreId = null;
  }

  validerNomSerre(utilisateur: any) {
    this.editeSerreId = null;

    const payload = {
      serre: {
        nom: utilisateur.serre.nom
      }
    };

    this.userService.updateUser(utilisateur._id, payload).subscribe({
      next: () => {
        alert("Nom de serre mis à jour !");
      },
      error: (err) => {
        console.error(err);
        alert("Erreur lors de la mise à jour du nom de la serre");
      }
    });
  }

  supprimerSerre(utilisateur: any) {
    if (confirm(`Supprimer la serre de ${utilisateur.firstName} ${utilisateur.lastName} ?`)) {
      utilisateur.serre.nom = '';
      this.sauvegarderDansLocalStorage();
    }
  }

  sauvegarderDansLocalStorage() {
    localStorage.setItem('donneesUtilisateurs', JSON.stringify(this.utilisateurs));
  }

  compterCapteurs(userId: string, type: string): number {
    const capteurs = this.capteursParUtilisateur[userId] || [];
    return capteurs.filter(c => c.type === type).length;
  }
  supprimerDernierCapteur(userId: string, type: string) {
    const capteurs = this.capteursParUtilisateur[userId] || [];
    const capteursFiltres = capteurs.filter(c => c.type === type);

    if (capteursFiltres.length === 0) {
      alert("Aucun capteur à supprimer !");
      return;
    }

    // On supprime le dernier ajouté (le plus récent dans la liste filtrée)
    const dernier = capteursFiltres[0]; // ou [capteursFiltres.length - 1] si tri inverse

    this.sensorService.deleteSensor(dernier._id).subscribe({
      next: () => {
        alert("Capteur supprimé !");
        // Recharge les capteurs
        this.sensorService.getSensorsByUser(userId).subscribe(capteursMaj => {
          this.capteursParUtilisateur[userId] = capteursMaj;
        });
      },
      error: (err) => {
        console.error(err);
        alert("Erreur lors de la suppression");
      }
    });
  }
  ajouterCapteur(userId: string, type: string) {
    const nomParDefaut = `${type.charAt(0).toUpperCase() + type.slice(1)} Sensor`;

    const nouveauCapteur = {
      name: nomParDefaut,
      type,
      unit: type === 'led' ? undefined : (type === 'humidity' ? '%' : '°C'),
      userId
    };

    this.sensorService.createSensor(nouveauCapteur).subscribe({
      next: () => {
        alert(`Capteur ${type} ajouté !`);
        this.sensorService.getSensorsByUser(userId).subscribe(capteurs => {
          this.capteursParUtilisateur[userId] = capteurs;
        });
      },
      error: (err) => {
        console.error(err);
        alert("Erreur lors de l'ajout du capteur");
      }
    });
  }
  rafraichir(sensorId: string) {
    this.measurementService.getLatestMeasurement(sensorId).subscribe({
      next: (mesure) => alert(`Nouvelle mesure : ${mesure.value} ${mesure.unit}`),
      error: (err: any) => console.error('Erreur mesure :', err)
    });
  }

  toggleLampe(capteur: any) {
    const nouvelleValeur = capteur.etat ? 0 : 1;
    this.measurementService.envoyerCommande(capteur._id, nouvelleValeur).subscribe({
      next: () => {
        capteur.etat = !capteur.etat; // mise à jour locale
        alert(`Lampe ${capteur.etat ? 'allumée' : 'éteinte'}`);
      },
      error: (err: any) => {
        console.error('Erreur envoi commande lampe :', err);
        alert("Impossible de changer l'état de la lampe.");
      }
    });
  }
  mesures: any[] = [];

  chargerMesures(): void {
    this.measurementService.getAllMeasurements().subscribe({
    next: (data) => {
      this.mesures = data.map((mesure: any) => {
        const dateUtc = new Date(mesure.takenAt);
        const dateMontreal = new Date(dateUtc.getTime() - 4 * 60 * 60 * 1000); // Ajustement -4h

        const jour = String(dateMontreal.getDate()).padStart(2, '0');
        const mois = String(dateMontreal.getMonth() + 1).padStart(2, '0');
        const annee = dateMontreal.getFullYear();
        const heure = String(dateMontreal.getHours()).padStart(2, '0');
        const minute = String(dateMontreal.getMinutes()).padStart(2, '0');

        const takenAtLocal = `${jour}/${mois}/${annee} à ${heure}:${minute}`;

        return { ...mesure, takenAtLocal };
      });
      },
      error: (err) => {
        console.error('Erreur lors du chargement des mesures :', err);
      }
    });
  }
modifierValeur(mesure: any) {
  const nouvelleValeur = prompt("Nouvelle valeur :", mesure.value);
  if (nouvelleValeur !== null) {
    this.measurementService.updateMeasurement(mesure._id, { value: Number(nouvelleValeur) }).subscribe({
      next: (maj) => {
        mesure.value = maj.value; //  on met à jour l'objet passé en paramètre
        alert("Valeur mise à jour !");
      },
      error: (err) => {
        console.error(err);
        alert("Erreur lors de la mise à jour");
      }
    });
  }
}

  supprimerMesure(id: string) {
    if (confirm("Supprimer cette mesure ?")) {
      this.measurementService.deleteMeasurement(id).subscribe({
        next: () => {
          this.mesures = this.mesures.filter(m => m._id !== id);
          alert("Mesure supprimée !");
        },
        error: (err) => {
          console.error(err);
          alert("Erreur lors de la suppression");
        }
      });
    }
  }
  get mesuresValides() {
  return this.mesures.filter(m => m.sensorId);
}
}
