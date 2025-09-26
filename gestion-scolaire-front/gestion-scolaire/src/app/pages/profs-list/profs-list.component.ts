import { NavbarComponent } from './../../components/navbar/navbar.component';
import { Component, OnInit } from '@angular/core';
import { ProfsService } from '../../service/profs.service';
import { Profs } from '../../models/prof.model';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profs-list',
  imports: [NavbarComponent],
  templateUrl: './profs-list.component.html',
  styleUrl: './profs-list.component.css',
})
export class ProfsListComponent implements OnInit {
  profs: Profs[] = [];

  constructor(private profservice: ProfsService, private router: Router) {}

  ngOnInit(): void {
    this.profservice.getProfs().subscribe({
      next: (data) => (this.profs = data),
      error: (err) => console.error('Erreur chargement des profs', err),
    });
  }

 modifier(prof: Profs) {
  this.router.navigate(['/profs/edit', prof.id_prof]);
    
    
    
  }

  supprimer(id: number) {
    if (confirm("Voulez-vous supprimer ce professeur ?")) {
      this.profservice.deleteProfs(id).subscribe({
        next: () => this.profs = this.profs.filter(p => p.id_prof !== id),
        error: err => console.error("Erreur suppression", err)
      });
    }
  }
}
