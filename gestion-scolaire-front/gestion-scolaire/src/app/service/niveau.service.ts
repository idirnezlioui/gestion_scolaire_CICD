import { Niveau } from './../models/niveau.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class NiveauService {
  private url="/api/niveaux"

  constructor(private http:HttpClient) { }

  getNiveau():Observable<Niveau[]>{
    return this.http.get<Niveau[]>(this.url)
  }

  addNiveau(niveau:Niveau):Observable<Niveau>{
    return this.http.post<Niveau>(this.url,niveau)
  }

  updateNiveau(id:number,niveau:Niveau):Observable<any>{
    return this.http.put<Niveau>(`${this.url}/${id}`,niveau)
  }

  deleteNiveau(id:number):Observable<any>{
    return this.http.delete(`${this.url}/${id}`)
  }
}
