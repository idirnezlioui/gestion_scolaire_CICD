import { Injectable } from '@angular/core';
import { Etudiant } from '../models/etudiant.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

interface LoginResponse {
  token: string;
  etudiant: Etudiant;
}

@Injectable({
  providedIn: 'root'
})
export class AuthEtudiant {
 private apiUrl = 'http://localhost:3000/api/etudiant-auth';

  constructor(private http: HttpClient) {}

  login(email: string, mot_de_passe: string): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, {
      email,
      mot_de_passe
    });
  }

  saveToken(token: string) {
    localStorage.setItem('token', token);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  logout() {
    localStorage.removeItem('token');
  }
}
