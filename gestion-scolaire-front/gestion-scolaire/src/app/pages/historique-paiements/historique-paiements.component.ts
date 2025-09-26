import { Component, OnInit } from '@angular/core';
import { PaiementEffectue } from '../../models/historique.model';
import { HistoriqueService } from '../../service/historique.service';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';

@Component({
  selector: 'app-historique-paiements',
  imports: [CommonModule,NavbarComponent],
  templateUrl: './historique-paiements.component.html',
  styleUrl: './historique-paiements.component.css'
})
export class HistoriquePaiementsComponent implements OnInit {
  paiements: PaiementEffectue[] = [];

  constructor(private service: HistoriqueService) {}

  ngOnInit(): void {
    this.service.getPaiementsEffectues().subscribe((data: PaiementEffectue[]) => {
    this.paiements = data;
    });
  }
}
