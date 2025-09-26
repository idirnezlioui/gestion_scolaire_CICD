import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Module } from './../models/module.model';



@Injectable({
  providedIn: 'root',
})
export class ModulesService {
  //le lien de mon api
  private url = '/api/modules';

  constructor(private http: HttpClient) {}

  getAll(): Observable<Module[]> {
    return this.http.get<Module[]>(this.url);
  }

  addModule(modules: Module): Observable<Module> {
    return this.http.post<Module>(this.url, modules);
  }

  updateModule(ref_module: number, module: Module):Observable<Module>{
    return this.http.put<Module>(`${this.url}/${ref_module}`, module)
  }

  deleteModule(ref_module: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${ref_module}`);
  }
}
