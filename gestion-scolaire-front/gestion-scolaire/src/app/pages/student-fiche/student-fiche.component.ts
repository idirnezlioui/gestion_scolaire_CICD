import { Component, Input } from '@angular/core';
import { Etudiant } from '../../models/etudiant.model';

@Component({
  selector: 'app-student-fiche',
  imports: [],
  templateUrl: './student-fiche.component.html',
  styleUrl: './student-fiche.component.css'
})
export class StudentFicheComponent {
  @Input() etudiant!: Partial<Etudiant>

  currentDate:string= new Date().toLocaleDateString()

}
