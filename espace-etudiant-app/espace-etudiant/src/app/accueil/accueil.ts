import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../layout/sidebar/sidebar';
import { EtudiantService } from '../services/etudiantService';
import { CommonModule } from '@angular/common';
import { Etudiant } from '../models/etudiant.model';
import { FormsModule } from '@angular/forms';
import { PresenceServiceTs } from '../services/presence.service.ts';
import { Presence } from '../models/presence.model';
import { jwtDecode } from 'jwt-decode';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-accueil',
  standalone: true,
  imports: [Sidebar, CommonModule, FormsModule],
  templateUrl: './accueil.html',
  styleUrl: './accueil.css',
})
export class Accueil implements OnInit {
  etudiant!: Etudiant;
  presences: Presence[] = [];
  totalPresences = 0;
  totalAbsences = 0;
  isLoading: boolean = false;

  evenements = [
    { title: 'Cours Algorithmique', date: 'Aujourd’hui 14h00' },
    { title: 'Examen Base de Données', date: 'Demain 9h00' },
    { title: 'TP Programmation Web', date: 'Vendredi 10h00' },
  ];

  constructor(
    private etudiantService: EtudiantService,
    private presenceService: PresenceServiceTs,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const decoded: any = token ? jwtDecode(token) : null;
    const numEtudiant = decoded?.id;

    if (numEtudiant) {
      this.etudiantService.getEtudiantById(numEtudiant).subscribe({
        next: (res) => {
          this.etudiant = {
            ...res.etudiant,
            photo: 'img/reglement.jpg',
            documents: 3,
            notifications: 0,
            presences: 0,
            absences: 0,
            pourcentage: 0,
          };
        },
        error: (err) => console.error('Erreur infos étudiant :', err),
      });

      this.presenceService.getByEtudiant(numEtudiant).subscribe({
        next: (data) => {
          this.presences = data;
          this.totalPresences = data.filter(p => p.statut === 'present').length;
          this.totalAbsences = data.filter(p => p.statut === 'absent').length;

          this.updateEtudiantData();
          this.cdr.detectChanges(); // forcer le rafraîchissement
        },
        error: (err) => console.error('Erreur présence :', err),
      });
    }
  }

  updateEtudiantData(): void {
    if (this.etudiant) {
      this.etudiant.presences = this.totalPresences;
      this.etudiant.absences = this.totalAbsences;
      this.etudiant.pourcentage = this.calculatePourcentage();
    }
  }

  calculatePourcentage(): number {
    const total = this.totalPresences + this.totalAbsences;
    return total ? Math.round((this.totalPresences / total) * 100) : 0;
  }

  actualiser(): void {
  this.isLoading = true;

  const token = localStorage.getItem('token');
  const decoded: any = token ? jwtDecode(token) : null;
  const numEtudiant = decoded?.id;

  if (numEtudiant) {
    this.etudiantService.getEtudiantById(numEtudiant).subscribe({
      next: (res) => {
        this.etudiant = {
          ...res.etudiant,
          photo: 'img/reglement.jpg',
          documents: 3,
          notifications: 0,
          presences: 0,
          absences: 0,
          pourcentage: 0,
        };
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur actualisation étudiant :', err);
        this.isLoading = false;
      },
    });

    this.presenceService.getByEtudiant(numEtudiant).subscribe({
      next: (data) => {
        this.presences = data;
        this.totalPresences = data.filter(p => p.statut === 'present').length;
        this.totalAbsences = data.filter(p => p.statut === 'absent').length;
        this.updateEtudiantData();
        this.cdr.detectChanges();
         setTimeout(() => {
        this.isLoading = false;
        this.cdr.detectChanges();
      }, 500); // ⏱️ 500 ms de délai
      },
      error: (err) => console.error('Erreur actualisation présences :', err),
    });
  }
}


}