import { Component, OnInit } from '@angular/core';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { StudentService } from '../../service/student.service';
import { AlertePaiement } from '../../models/alerte-paiement.model';
import { CommonModule } from '@angular/common';


@Component({
  standalone: true,
  selector: 'app-alerte-paiement',
  imports: [NavbarComponent,CommonModule],
  templateUrl: './alerte-paiement.component.html',
  styleUrl: './alerte-paiement.component.css'
})
export class AlertePaiementComponent implements OnInit{

   paiements: AlertePaiement[] = [];
  constructor(private studentService:StudentService){}

  ngOnInit(): void {
    this.studentService.getPaiementsProchains().subscribe({
      next:(data)=>{
        this.paiements=data
      },
      error:(err)=>{
        console.log("erreure des alerte de paiement",err)
      }
    })
    
  }

 envoyerEmail(p: AlertePaiement) {
  const body = {
    nom: p.nom,
    prenom: p.prenom,
    email: p.email,
    datePaiement: p.date_max_paiement,
  };

  this.studentService.envoyerAlertePaiement(body).subscribe({
    next: () => alert(" Email envoyé avec succès"),
    error: () => alert("Erreur lors de l'envoi"),
  });
}
}
