import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Utilisateur } from '../models/utilisateur.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UtilisateurService {
  private url = '/api/utilisateurs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Utilisateur[]> {
    return this.http.get<Utilisateur[]>(this.url);
  }

  create(user: Utilisateur): Observable<any> {
    return this.http.post(this.url, user);
  }

  update(id: number, user: Utilisateur): Observable<any> {
    return this.http.put(`${this.url}/${id}`, user);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.url}/${id}`);
  }
}
