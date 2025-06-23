import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { WebsiteServices } from '../websiteServices';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-formulaire-connexion',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './formulaire-connexion.component.html',
  styleUrl: './formulaire-connexion.component.css'
})
export class FormulaireConnexionComponent {
   applyForm = new FormGroup({
    email: new FormControl(''),
    password: new FormControl(''),
  });

  constructor(private websiteServices: WebsiteServices) {}

  submitConnexion() {
    this.websiteServices.submitData(
      this.applyForm.value.email ?? '',
      this.applyForm.value.password ?? '',
    );
  }
}


