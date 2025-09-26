import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EtudiantService } from '../services/etudiantService';
import { Etudiant } from '../models/etudiant.model';
import { jwtDecode } from 'jwt-decode';
import { ChangeDetectorRef } from '@angular/core';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-certificat',
  imports: [CommonModule],
  templateUrl: './certificat.html',
  styleUrl: './certificat.css'
})
export class Certificat  implements OnInit {

  etudiant!: Etudiant;

  constructor(private etudiantService: EtudiantService, private cdr: ChangeDetectorRef){}


  ngOnInit(): void {
    const token = localStorage.getItem('token');
    const decoded: any = token ? jwtDecode(token) : null;
    const numEtudiant = decoded?.id;

    if (numEtudiant) {
      this.etudiantService.getEtudiantById(numEtudiant).subscribe({
        next: (res) => {
          this.etudiant = {
            ...res.etudiant,
            adresse: '34 All. des Platanes, 93800 Épinay-sur-Seine',
            date_naissance: '24/06/2004',
            lieu_naissance: 'Tizi-Ouzou (Algérie)',
            specialite: res.etudiant.domaine,
            duree: '1 an',
            date_debut: '21/10/2024',
            date_fin: '20/10/2025',
            date_certificat: '15/10/2024',
            lieu_certificat: 'Fait à Paris'
          };

          this.cdr.detectChanges(); // 🔄 Forcer la détection de changements
        },
        error: (err) => console.error("Erreur lors de la récupération de l'étudiant :", err)
      });
    }
  }

  async telechargerPDF(): Promise<void> {
  const element = document.getElementById('certificat-pdf');
  if (!element) return;

  const canvas = await html2canvas(element, { scale: 2 }as any);
  const imgData = canvas.toDataURL('image/png');

  const pdf = new jsPDF('p', 'mm', 'a4');
  const width = pdf.internal.pageSize.getWidth();
  const height = (canvas.height * width) / canvas.width;

  pdf.addImage(imgData, 'PNG', 0, 0, width, height);
  pdf.save(`certificat-${this.etudiant.nom}-${this.etudiant.num_etudiant}.pdf`);
}
}

