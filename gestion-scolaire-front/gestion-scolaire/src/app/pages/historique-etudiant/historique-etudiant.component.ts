import { Component, OnInit } from '@angular/core';
import { HistoriqueService } from '../../service/historique.service';
import { AjoutEtudiant } from '../../models/historique.model';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-historique-etudiant',
  imports: [CommonModule,NavbarComponent],
  templateUrl: './historique-etudiant.component.html',
  styleUrl: './historique-etudiant.component.css'
})
export class HistoriqueEtudiantComponent  implements OnInit {

   ajouts: AjoutEtudiant[] = [];

  constructor(private service: HistoriqueService) {}

  ngOnInit(): void {
    this.service.getAjoutsEtudiants().subscribe((data: AjoutEtudiant[]) => {
  this.ajouts = data;
});

  }

}
