import { Component, Input } from '@angular/core';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Etudiant } from './../../models/etudiant.model';
import { Paiement } from './../../models/paiment.model';

@Component({
  selector: 'app-student-recu',
  templateUrl: './student-recu.component.html',
  styleUrls: ['./student-recu.component.css'],
})
export class StudentRecuComponent {
  @Input() paiement!: Paiement;
  @Input() etudiant: Partial<Etudiant> = {};

  currentDate: string = new Date().toLocaleDateString();

  ngOnChanges() {
    console.log('Reçu mis à jour :', this.paiement, this.etudiant);
  }

  imprimerRecu() {
    const recu = new jsPDF();
    const logo="img/logoEcole.png"
    recu.addImage(logo,"png",10,10,30,30)

    recu.setFont('helvetica', 'bold');
    recu.setFontSize(18);
    recu.text('Reçu de paiement', 70, 15);

    recu.setFontSize(12);
    recu.setFont('helvetica', 'normal');
    recu.text(`École : Golden Collar`, 10, 50);
    recu.text(
      `Nom : ${this.etudiant.nom || 'Votre nom'} ${
        this.etudiant.prenom || 'Prénom'
      }`,
      10,
      40
    );
    recu.text(`ID étudiant : ${this.etudiant.num_etudiant || 'N/A'}`, 10, 60);
    recu.text(
      `Date du paiement : ${this.paiement.date_paiement || 'N/A'}`,
      10,
      70
    );

    autoTable(recu, {
      startY: 90,
      head: [['Désignation', 'Détaille']],
      body: [
        ['Montant payé', `${this.paiement.montant_paye || '0'} €`],
        ['Solde restant', `${this.paiement.solde_restant || '0'} €`],
        ['Statut', `${this.paiement.statut_paiment || 'Inconnu'}`],
        ['Remise', `${this.paiement.remise} €`],
        ['Prochain paiement', `${this.paiement.date_max_paiement || 'N/A'}`],
      ],
      theme: 'grid',
    });

    const finalY = (recu as any).lastAutoTable?.finalY || 100;
    recu.text("Signature de l'administration", 140, finalY + 20);

    recu.save(
      `Reçu_${this.etudiant.nom || 'Inconnu'}_${
        this.etudiant.prenom || 'Inconnu'
      }.pdf`
    );
  }
}
