import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { StudentService } from '../../service/student.service';
import { Etudiant } from '../../models/etudiant.model';

@Component({
  selector: 'app-student-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './student-search.component.html',
  styleUrls: ['./student-search.component.css']
})
export class StudentSearchComponent implements OnInit {
  @Output() studentSelected = new EventEmitter<Etudiant>();

  etudiants: Etudiant[] = [];
  filterEtudiant: Etudiant[] = [];
  searchId = '';
  searchterm = '';
  showDropdown = false;

  constructor(private studentService: StudentService) {}

  ngOnInit(): void {
    this.studentService.getEtudiants().subscribe((data) => {
      this.etudiants = data;
      this.filterEtudiant = [...data];
    });
  }

  searchById() {
  const searchValue = this.searchId?.toString().trim(); // ✅ converti en string + trim

  this.filterEtudiant = searchValue
    ? this.etudiants.filter((s) =>
        s.num_etudiant?.toString().includes(searchValue)
      )
    : [...this.etudiants];

  this.showDropdown = this.filterEtudiant.length > 0;
}


  searchByName() {
    this.filterEtudiant = this.searchterm.trim()
      ? this.etudiants.filter((s) =>
          `${s.nom?.toLowerCase()} ${s.prenom?.toLowerCase()}`.includes(this.searchterm.toLowerCase())
        )
      : [...this.etudiants];
    this.showDropdown = this.filterEtudiant.length > 0;
  }

  selectStudent(student: Etudiant) {
    this.studentSelected.emit(student);
    this.showDropdown = false;
  }
}
