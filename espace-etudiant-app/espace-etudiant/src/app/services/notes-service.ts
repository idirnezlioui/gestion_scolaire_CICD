import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Note, RawNote } from '../models/note.model';

@Injectable({
  providedIn: 'root'
})
export class NotesService {
  private apiUrl = 'http://localhost:3000/api/notes';

  constructor(private http: HttpClient) {}

 
  getNotesByEtudiant(numEtudiant: number): Observable<RawNote[]> {
    return this.http.get<RawNote[]>(`${this.apiUrl}/etudiants/${numEtudiant}/notes`);
  }

  
}
