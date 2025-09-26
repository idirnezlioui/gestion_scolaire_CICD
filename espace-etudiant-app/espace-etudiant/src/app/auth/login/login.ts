import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthEtudiant } from '../../services/auth-etudiant';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone:true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {
  email = '';
  password = '';
  remember = false;
   erreurMessage = '';

  constructor(private authService: AuthEtudiant,
    private router: Router){}

   onSubmit() {
    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        this.authService.saveToken(response.token);
        this.router.navigate(['/accueil']);
      },
      error: (error) => {
        this.erreurMessage = error.error.message || 'Erreur de connexion';
      }
    });
  }
}
