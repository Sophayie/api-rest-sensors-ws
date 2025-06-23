import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { WebsiteServices } from '../websiteServices';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-formulaire-inscription',
  standalone: true,
  imports: [ReactiveFormsModule,CommonModule],
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

  constructor(private websiteServices: WebsiteServices) {}

  submitInscription() {
    if (this.applyForm.valid) {
      this.websiteServices.submitData1(
        this.applyForm.value.firstname ?? '',
        this.applyForm.value.lastname ?? '',
        this.applyForm.value.email ?? '',
        this.applyForm.value.password ?? '',
      );
    } else {
      this.applyForm.markAllAsTouched();
      console.warn("Formulaire invalide");
    }
  }
}
