import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { Sidebar } from "../../layout/sidebar/sidebar";
import { Document } from '../../services/document';  
import { jwtDecode } from 'jwt-decode';
import { EtudiantService } from '../../services/etudiantService';
import { Router } from '@angular/router';

@Component({
  selector: 'app-certificats',
  imports: [Sidebar],
  templateUrl: './certificats.html',
  styleUrl: './certificats.css'
})
export class Certificats implements OnInit {
  numEtudiant: number = 0;
  isLoading = true;
  documentsDispo: string[] = [];
  constructor (private documentService: Document,private cdr: ChangeDetectorRef,
    private etudiantService: EtudiantService,
    private router: Router){}

  ngOnInit(): void {
  try {
    const token = localStorage.getItem('token');
    if (!token) return this.handleInvalidToken();

    const decoded: any = jwtDecode(token);
    const id = decoded?.id;

    if (!id) return this.handleInvalidToken();

    this.numEtudiant = id;

    // Appel à l’API pour récupérer les noms de fichiers
    this.documentService.getDocumentNames(this.numEtudiant).subscribe({
      next: (docs) => {
        this.documentsDispo = docs.map(d => d.nom_document);
        this.isLoading = false;
        this.cdr.detectChanges(); // facultatif
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des documents:', err);
        this.isLoading = false;
      }
    });

  } catch (error) {
    console.error('Erreur inattendue dans ngOnInit:', error);
    this.handleInvalidToken();
  }
}

  private handleInvalidToken(): void {
    localStorage.clear();
    this.isLoading = false;
    this.router.navigate(['/login']);
  }

  download(nom_document: string) {
    if (!this.numEtudiant) {
      console.error('Étudiant non authentifié');
      return;
    }

    this.documentService.downloadDocument(this.numEtudiant, nom_document).subscribe({
      next: (blob: Blob) => {
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = nom_document;
        link.click();
        window.URL.revokeObjectURL(url);
      },
      error: (err) => {
        console.error('Erreur de téléchargement :', err);
      }
    });
  }
}