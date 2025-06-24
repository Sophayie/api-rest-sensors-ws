import { Component } from '@angular/core';
import { FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../user.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-formulaire-connexion',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, RouterModule],
  templateUrl: './formulaire-connexion.component.html',
  styleUrl: './formulaire-connexion.component.css'
})
export class FormulaireConnexionComponent {
  applyForm = new FormGroup({
    email: new FormControl('', Validators.required),
    password: new FormControl('', Validators.required)
  });

  constructor(private userService: UserService, private router: Router) { }

  submitConnexion() {
    if (this.applyForm.valid) {
      const credentials = {
        email: this.applyForm.value.email ?? '',
        motdepasse: this.applyForm.value.password ?? ''
      };

      this.userService.loginUser(credentials).subscribe({
  next: (res) => {
    localStorage.setItem('token', res.token);
    localStorage.setItem('isAdmin', res.isAdmin.toString());
    localStorage.setItem('userId', res._id);
    localStorage.setItem('firstName', res.firstName);
    localStorage.setItem('lastName', res.lastName);
    localStorage.setItem('email', res.email);

    alert('Connexion réussie ');

    //  Redirection unique vers le dashboard
    this.router.navigate(['/dashboard']);
  },
  error: (err) => {
    alert('Erreur lors de la connexion : ' + err.error.message);
    console.error(err);
  }
});
  } else {
  this.applyForm.markAllAsTouched();
}
  }
}
