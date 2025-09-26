import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Module } from './../models/module.model';
import { Observable } from 'rxjs';
import { Note } from '../models/note.model';

@Injectable({
  providedIn: 'root',
})
export class NotesService {
    private url = '/api/notes';

  constructor(private http: HttpClient) {}

  getModulesByEtudiant(id: string): Observable<Module[]> {
    return this.http.get<Module[]>(`${this.url}/etudiants/${id}/modules`);
  }

  getNotesByEtudiant(id: string): Observable<Note[]> {
    return this.http.get<Note[]>(`${this.url}/etudiants/${id}/notes`);
  }

  insertNote(note: {
    ref_module: string;
    num_etudiant: string; 
    note: number;
  }): Observable<any> {
    return this.http.post(`${this.url}/`, note);
  }

  updateNote(note: {
    ref_note: string;
    ref_module: string;
    num_etudiant: string; 
    note: number;
  }): Observable<any> {
    return this.http.put(`${this.url}/`, note);
  }
  uploadDocument(formData: FormData): Observable<any> {
  return this.http.post('/api/documents', formData);
}

}