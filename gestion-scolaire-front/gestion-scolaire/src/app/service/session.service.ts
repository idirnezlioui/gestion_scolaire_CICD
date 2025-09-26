import { Session } from './../models/session.model';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SessionService {
  private url="/api/sessions"

  constructor(private http:HttpClient) { }

  getSession():Observable<Session[]>{
    return this.http.get<Session[]>(this.url)
  }

  createSession(session:Session):Observable<Session>{
    return this.http.post<Session>(this.url,session)
  }

  deleteSession(id_session:number):Observable<void>{
    return this.http.delete<void>(`${this.url}/${id_session}`)
  }

  updateSession(id_session:number,session:Session):Observable<Session>{
    return this.http.put<Session>(`${this.url}/${id_session}`,session)
  }

}
