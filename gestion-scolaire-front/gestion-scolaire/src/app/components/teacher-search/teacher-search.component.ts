import { Profs } from './../../models/prof.model';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfsService } from '../../service/profs.service';

@Component({
  selector: 'app-teacher-search',
  imports: [CommonModule, FormsModule],
  templateUrl: './teacher-search.component.html',
  styleUrl: './teacher-search.component.css'
})
export class TeacherSearchComponent implements OnInit {
  @Output() profSelected = new EventEmitter<any>();
  prof: Profs[] = [];
  filterProfs: Profs[] = [];
  searchId = '';
  searchterm = '';
  showDropdown = false;

  constructor(private profService: ProfsService) {}

  ngOnInit(): void {
    this.profService.getProfs().subscribe((data) => {
      this.prof = data;
      this.filterProfs = [...data];
    });
  }

  searchById() {
  const searchValue = this.searchId?.toString().trim(); // ✅ converti en string + trim

  this.filterProfs = searchValue
    ? this.prof.filter((s) =>
        s.id_prof?.toString().includes(searchValue)
      )
    : [...this.prof];

  this.showDropdown = this.filterProfs.length > 0;
}


  searchByName() {
    this.filterProfs = this.searchterm.trim()
      ? this.prof.filter((s) =>
          `${s.nom?.toLowerCase()} ${s.prenom?.toLowerCase()}`.includes(this.searchterm.toLowerCase())
        )
      : [...this.prof];
    this.showDropdown = this.filterProfs.length > 0;
  }

 selectProf(prof: any) {
  this.profSelected.emit(prof);
  this.showDropdown = false;
}
}

