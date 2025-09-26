import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Document {
  constructor(private http: HttpClient) {}

  private apiUrl ="http://localhost:3000/api/documents"

  downloadDocument(num_etudiant: number, nom_document: string): Observable<Blob> {
  const url = `${this.apiUrl}/${num_etudiant}/${nom_document}`;
  return this.http.get(url, { responseType: 'blob' });
}

getDocumentNames(num_etudiant: number): Observable<{ nom_document: string }[]> {
  return this.http.get<{ nom_document: string }[]>(`${this.apiUrl}/${num_etudiant}`);
}

}
