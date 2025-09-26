import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Presence } from '../models/presence.model';

@Injectable({
  providedIn: 'root'
})
export class PresenceService {
  private url = '/api/presence';

  constructor(private http: HttpClient) {}

  enregistrerPresences(presences: Presence[]): Observable<any> {
    return this.http.post(`${this.url}/saisie`, { presences });
  }
  getPresencesParNiveauDomaine(niveau: string, domaine: string) {
  return this.http.get<Presence[]>(`${this.url}/${niveau}/${domaine}`);
}
getSeanceAttendue(numEtudiant: number, refModule: number): Observable<{ seance_attendue: number }> {
    return this.http.get<{ seance_attendue: number }>(
      `${this.url}/seance-attendue/${numEtudiant}/${refModule}`
    );
  }

}
