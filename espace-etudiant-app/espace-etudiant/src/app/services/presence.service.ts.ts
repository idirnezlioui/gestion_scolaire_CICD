import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Presence } from '../models/presence.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PresenceServiceTs {
  private baseUrl = 'http://localhost:3000/api/presence';

  constructor(private http: HttpClient) {}

  getByEtudiant(num_etudiant: string): Observable<Presence[]> {
    return this.http.get<Presence[]>(`${this.baseUrl}/etudiant/${num_etudiant}`);
  }
}
