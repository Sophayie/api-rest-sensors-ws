import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-compte',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './compte.component.html',
  styleUrl: './compte.component.css'
})
export class CompteComponent implements OnInit {
  isAdmin = false;
  firstName = '';
  lastName = '';
  email = '';

  constructor(private router: Router) { }

  ngOnInit(): void {
    console.log("🔄 ngOnInit lancé dans CompteComponent");

    this.isAdmin = localStorage.getItem('isAdmin') === 'true';
    this.firstName = localStorage.getItem('firstName') ?? '';
    this.lastName = localStorage.getItem('lastName') ?? '';
    this.email = localStorage.getItem('email') ?? '';

    console.log("👤 isAdmin =", this.isAdmin);
  }

  seDeconnecter(): void {
    const confirmation = confirm("Voulez-vous vraiment vous déconnecter ?");
    if (confirmation) {
      localStorage.clear();
      this.router.navigate(['/']);
    }
  }
}
