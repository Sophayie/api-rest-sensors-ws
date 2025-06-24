import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-formulaire-inscription',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './formulaire-inscription.component.html',
  styleUrl: './formulaire-inscription.component.css'
})
export class FormulaireInscriptionComponent {
  applyForm = new FormGroup({
    firstname: new FormControl('', Validators.required),
    lastname: new FormControl('', Validators.required),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  constructor(
    private userService: UserService,
    private router: Router
  ) {}
  errorMessage: string = '';

submitInscription() {
  if (this.applyForm.valid) {
    const user = {
      firstName: this.applyForm.value.firstname ?? '',
      lastName: this.applyForm.value.lastname ?? '',
      email: this.applyForm.value.email ?? '',
      motdepasse: this.applyForm.value.password ?? ''
    };

    this.userService.registerAsAdminFromPublic(user).subscribe({
      next: (res) => {
        this.errorMessage = '';
        alert('Inscription réussie! Vous êtes maintenant administrateur.');
        console.log('Redirection en cours vers /connexion...');
        this.router.navigate(['/']).catch(err => {
          console.error('Erreur lors de la redirection :', err);
        });
      },
      error: (err) => {
        this.errorMessage = err.error.message || 'Erreur lors de l’inscription.';
      }
    });

  } else {
    this.applyForm.markAllAsTouched();
    this.errorMessage = "Veuillez remplir tous les champs correctement.";
  }
}
 }

