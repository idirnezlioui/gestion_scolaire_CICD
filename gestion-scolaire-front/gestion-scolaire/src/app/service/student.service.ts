import { Etudiant } from './../models/etudiant.model';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AlertePaiement } from '../models/alerte-paiement.model';


@Injectable({
  providedIn: 'root'
})
export class StudentService {
  //recupre url de mon backend 

  private url="/api/etudiants"

  constructor(private http:HttpClient) { }

  getEtudiants():Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(this.url)
  }
creatEtudiant(data: any): Observable<any> {
  const token = localStorage.getItem('token');
  const headers = {
    Authorization: `Bearer ${token}`
  };
  return this.http.post(`${this.url}`, data, { headers });
}
getEtudiantById(id: number): Observable<{ etudiant: Etudiant }> {
  return this.http.get<{ etudiant: Etudiant }>(`${this.url}/${id}`);
}

updateEtudiant(id: number, data: any): Observable<any> {
  return this.http.put(`${this.url}/${id}`, data);
}

//recupere les alertes des étudiants 
getPaiementsProchains(): Observable<AlertePaiement[]> {
  return this.http.get<AlertePaiement[]>('/api/paiement/alertes/paiement-prochain');
}
envoyerAlertePaiement(body: {
  nom: string;
  prenom: string;
  email: string;
  datePaiement: string;
}): Observable<any> {
  return this.http.post('/api/mail/alerte-paiement', body);
}
getEtudiantsAvecSeances(niveau: string, domaine: string): Observable<any[]> {
  const url = `/api/etudiants/seances/${encodeURIComponent(niveau)}/${encodeURIComponent(domaine)}`;
  return this.http.get<any[]>(url);
}


}
