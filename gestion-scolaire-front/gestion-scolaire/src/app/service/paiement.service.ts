import { Paiement } from './../models/paiment.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaiementService {
  private url = '/api/paiement';

  constructor(private http: HttpClient) {}

  ajouterunPaiement(paiement: Paiement) {
    console.log(
      'Données envoyées au serveur:',
      JSON.stringify(paiement, null, 2)
    );
    return this.http.post(`${this.url}/ajouter`, paiement).pipe(
      catchError((error) => {
        console.error("Erreur lors de l'enregistrement du paiement", error);
        return throwError(() => new Error('Une erreur est survenue'));
      })
    );
  }

  //recupére tous les paiement

  getPaiements(): Observable<Paiement[]> {
    return this.http.get<Paiement[]>(this.url);
  }

  // verification remise
  verifierRemise(idEtudiant: string): Observable<boolean> {
  return this.http.get<boolean>(`${this.url}/verifier-remise/${idEtudiant}`);
}

  //recupere les tarif de la formation
  getTarifFormation(idEtudiant: string): Observable<{ tarif: number }> {
  return this.http.get<{ tarif: number }>(`${this.url}/tarif-formation/${idEtudiant}`);
}

  // Récupérer les paiements d'un étudiant par son ID
  getPaiementsByEtudiant(idEtudiant: string): Observable<Paiement[]> {
  return this.http.get<Paiement[]>(`${this.url}/solde-restant/${idEtudiant}`);
}
  
}
