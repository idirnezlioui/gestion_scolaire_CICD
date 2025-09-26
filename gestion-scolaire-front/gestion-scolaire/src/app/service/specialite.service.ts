
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


export interface Specialite {
  sigle_specia: string;
  intitule: string;
}

@Injectable({
  providedIn: 'root'
})

export class SpecialiteService {
  private apiUrl='/api/specialite'
  constructor(private http:HttpClient) { }

  getAll():Observable<Specialite[]>{
    return this.http.get<Specialite[]>(this.apiUrl)
  }

  addSpecialite(specialite:Specialite):Observable<Specialite>{
    return this.http.post<Specialite>(this.apiUrl,specialite)
  }

  updateSpecialite(sigle:string,specialite:Specialite):Observable<Specialite>{
    return this.http.put<Specialite>(`${this.apiUrl}/${sigle}`,specialite)
  }

  deleteSpecialite(sigle:string):Observable<void>{
    return this.http.delete<void>(`${this.apiUrl}/${sigle}`)
  }


}
