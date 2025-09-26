import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../layout/sidebar/sidebar';
import { CommonModule } from '@angular/common';
import { Note } from '../models/note.model';
import { NotesService } from '../services/notes-service';
import { jwtDecode } from 'jwt-decode';
import { RawNote } from '../models/note.model';
import { ChangeDetectorRef } from '@angular/core';
import { EtudiantService } from '../services/etudiantService';
import { Etudiant } from '../models/etudiant.model';
import { Router } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-notes',
  imports: [Sidebar, CommonModule],
  templateUrl: './notes.html',
  styleUrl: './notes.css',
})
export class Notes implements OnInit {
  notes: Note[] = [];
  etudiant: Etudiant | null = null;

  moyenne: number = 0;
  matieresValidees: number = 0;
  totalMatieres: number = 0;
  creditsValides: number = 0;
  tauxValidation: number = 0;
  isLoading = true;
  constructor(
    private notesService: NotesService,
    private cdr: ChangeDetectorRef,
    private etudiantService: EtudiantService,
    private router: Router
  ) {}

  ngOnInit(): void {
    try {
      const token = localStorage.getItem('token');

      if (!token) {
        console.error('Token manquant');
        this.handleInvalidToken();
        return;
      }

      const decoded: any = jwtDecode(token);
      console.log('Token décodé:', decoded);

      const id = decoded?.id;

      if (!id) {
        console.error('ID étudiant manquant dans le token');
        this.handleInvalidToken();
        return;
      }

      // Étape 1 : Récupération des notes
      this.notesService.getNotesByEtudiant(id).subscribe({
        next: (res: RawNote[]) => {
          this.notes = res.map((note): Note => {
            const numericNote =
              typeof note.note === 'string' ? parseFloat(note.note) : note.note;
            const session = numericNote < 7 ? 'Rattrapage' : 'Normale';
            const observation =
              numericNote < 7
                ? 'Non validé'
                : numericNote < 10
                ? 'En attente'
                : 'Validé';

            return { ...note, note: numericNote, session, observation };
          });

          // Calcul moyenne
          this.moyenne = this.notes.length
            ? +(
                this.notes.reduce((sum, n) => sum + n.note, 0) /
                this.notes.length
              ).toFixed(2)
            : 0;

          const notesAvecValeurs = this.notes.filter((n) => !isNaN(n.note));
          const notesValidees = notesAvecValeurs.filter((n) => n.note >= 10);

          this.totalMatieres = this.notes.length;
          this.matieresValidees = notesValidees.length;
          this.creditsValides = notesValidees.length; // si tous les coeffs = 1
          this.tauxValidation = this.totalMatieres
            ? Math.round((this.matieresValidees / this.totalMatieres) * 100)
            : 0;

          // Étape 2 : Récupération des infos de l'étudiant
          this.remplirInfosEtudiant(id);
        },
        error: (err) => {
          console.error('Erreur lors de la récupération des notes:', err);
          this.isLoading = false;
        },
      });
    } catch (error) {
      console.error('Erreur inattendue dans ngOnInit:', error);
      this.handleInvalidToken();
    }
  }

  private handleInvalidToken(): void {
    localStorage.clear();
    this.isLoading = false;
    // rediriger vers login si tu veux :
    this.router.navigate(['/login']);
  }

  calculerMoyenne(): void {
    const total = this.notes.reduce((sum, n) => sum + n.note, 0);
    this.moyenne = this.notes.length
      ? +(total / this.notes.length).toFixed(2)
      : 0;

    if (this.etudiant) {
      this.etudiant.moyenne = this.moyenne;
    }
  }

  remplirInfosEtudiant(id: number): void {
    this.etudiantService.getEtudiantById(id).subscribe({
      next: (res) => {
        const etu = res.etudiant as any; // ✅ c’est ici la bonne donnée

        if (!etu) {
          console.warn('Aucun étudiant trouvé');
          return;
        }

        this.etudiant = {
          ...etu,
          domaine: etu.intitule_domaine,
          moyenne: this.moyenne,
          dateMaj: new Date().toLocaleDateString('fr-FR'),
        };

        this.isLoading = false;
        this.cdr.detectChanges();
        console.log('Étudiant final assigné :', this.etudiant);
      },
      error: (err) => {
        console.error('Erreur récupération étudiant :', err);
      },
    });
  }

  getNoteColor(note: number): string {
    if (note >= 15) return 'text-green-600';
    if (note >= 10) return 'text-yellow-600';
    return 'text-red-600';
  }

  getObservationBadge(obs: string): string {
    return (
      {
        Validé: 'bg-green-100 text-green-700',
        'Non validé': 'bg-red-100 text-red-700',
        'En attente': 'bg-yellow-100 text-yellow-700',
      }[obs] || 'bg-gray-100 text-gray-700'
    );
  }

  getSessionBadge(session: string): string {
    return session === 'Normale'
      ? 'bg-blue-100 text-blue-700'
      : 'bg-orange-100 text-orange-700';
  }
}
