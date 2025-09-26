import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Etudiant } from '../models/etudiant.model';
import { HttpHeaders } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class EtudiantService {
  private apiUrl = 'http://localhost:3000/api/etudiants';

  // cache courant
  private _current$ = new BehaviorSubject<Etudiant | null>(null);
  current$ = this._current$.asObservable();

  constructor(private http: HttpClient) {
    const cached = localStorage.getItem('me');
    if (cached) this._current$.next(JSON.parse(cached));
  }

  /** Getter pratique */
  get current(): Etudiant | null {
    return this._current$.value;
  }

  /** Remonte tous les étudiants (inchangé) */
  getAllEtudiants(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(this.apiUrl);
  }

  /** Charge l’étudiant et alimente le cache */
  getEtudiantById(id: number) {
    return this.http.get<{ etudiant: Etudiant }>(`${this.apiUrl}/${id}`).pipe(
      tap(({ etudiant }) => this.setCache(etudiant))
    );
  }

  /** Update perso + mise à jour *optimiste* du cache */
  updatePersonal(id: number, payload: any) {
  const token = localStorage.getItem('token') || '';
  const headers = new HttpHeaders({
    Authorization: `Bearer ${token}`
  });

  return this.http.put(`${this.apiUrl}/${id}/personal`, payload, { headers })
    .pipe(
      tap(() => {
        localStorage.removeItem('me');
        this.getEtudiantById(id).subscribe();
      })
    );
}

  /** Utilitaire cache */
  private setCache(e: Etudiant) {
    this._current$.next(e);
    localStorage.setItem('me', JSON.stringify(e));
  }

  /** À appeler au logout par ex. */
  clearCache() {
    localStorage.removeItem('me');
    this._current$.next(null);
  }
}
