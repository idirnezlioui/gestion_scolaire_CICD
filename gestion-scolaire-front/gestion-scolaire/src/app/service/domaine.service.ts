import { Domaine } from './../models/domaine.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DomaineService {

  //le lien de mon api
  private url="/api/domaines"

  constructor(private http:HttpClient) {}
    getDomaine():Observable<Domaine[]>{
      return this.http.get<Domaine[]>(this.url)
    }

    addDomaine(domaine:Domaine):Observable<Domaine>{
      return this.http.post<Domaine>(this.url,domaine)
    }

    updateDomaine(id: number, domaine: Domaine): Observable<any> {
      return this.http.put(`${this.url}/${id}`, domaine);
    }

    deleteDomaine(id: number): Observable<any> {
      return this.http.delete(`${this.url}/${id}`);
    }

}
