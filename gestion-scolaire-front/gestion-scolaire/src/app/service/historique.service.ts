import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AjoutEtudiant, PaiementEffectue } from '../models/historique.model';

@Injectable({
  providedIn: 'root'
})
export class HistoriqueService {

  constructor(private http: HttpClient) {}

  private url = '/api/historique';

  

  getAjoutsEtudiants(): Observable<AjoutEtudiant[]> {
    return this.http.get<AjoutEtudiant[]>(`${this.url}/ajout-etudiant`);
  }

  getPaiementsEffectues(): Observable<PaiementEffectue[]> {
    return this.http.get<PaiementEffectue[]>(`${this.url}/paiements`);
  }
}
