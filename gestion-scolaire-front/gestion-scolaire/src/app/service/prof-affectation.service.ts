import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ProfAffectation } from './../models/prof-affectation.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfAffectationService {
  private url="/api/prof_modules_niveaux"

  constructor(private http:HttpClient) { }

addAffectation(data: any): Observable<any> {
  return this.http.post('/api/prof_modules_niveaux', data);
}

getAffectationsByProf(id_prof: number): Observable<{ ref_module: number, id_niveau: number }[]> {
  return this.http.get<{ ref_module: number, id_niveau: number }[]>(`${this.url}/${id_prof}`);
}

deleteByModule(data: { id_prof: number, ref_module: number }): Observable<any> {
  return this.http.request('DELETE', `${this.url}/module`, { body: data });
}

deleteByNiveau(data: { id_prof: number, id_niveau: number }): Observable<any> {
  return this.http.request('DELETE', `${this.url}/niveau`, { body: data });
}

addSingle(data: any): Observable<any> {
  return this.http.post(`${this.url}/single`, data);
}

deleteSingle(data: { id_prof: number; ref_module: number; id_niveau: number }): Observable<any> {
  return this.http.request('DELETE', `${this.url}/single`, { body: data });
}



}
