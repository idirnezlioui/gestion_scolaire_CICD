import { Injectable } from '@angular/core';
import { Profs } from '../models/prof.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfsService {
  private url="/api/profs"

  constructor(private http:HttpClient) { }
  getProfs():Observable<Profs[]>{
    return this.http.get<Profs[]>(this.url)
  }

  addProfs(profs:Profs):Observable<Profs>{
    return this.http.post<Profs>(this.url,profs)
  }

  updateProfs(id:number,profs:Profs):Observable<any>{
    return this.http.put<Profs>(`${this.url}/${id}`,profs)
  }

  deleteProfs(id:number):Observable<any>{
    return this.http.delete(`${this.url}/${id}`)
  }
  getProfById(id: number): Observable<Profs> {
  return this.http.get<Profs>(`${this.url}/${id}`);
}

}
