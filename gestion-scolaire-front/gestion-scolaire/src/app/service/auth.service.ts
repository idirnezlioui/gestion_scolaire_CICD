import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from "rxjs";
import {Router} from "@angular/router"
import { Login } from '../models/login.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private url = '/api/auth';

  constructor(private http:HttpClient,private router:Router) { }

  login(data:Login){
    return this.http.post<any>(`${this.url}/login`,data).pipe(
      tap(response=>{
        localStorage.setItem('token',response.token)
        localStorage.setItem('user',JSON.stringify(response.utilisateur))
      })
    )
  }

  logout(){
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    this.router.navigate(['/login'])
  }

  isLoggedIn():boolean{
    return !! localStorage.getItem('token')
  }

  getUser(){
    return JSON.parse(localStorage.getItem('user') || '{}')
  }

  getToken(){
    return localStorage.getItem('token')
  }

  isAdmin(){
    return this.getUser().role ==='admin'
  }
  isProf(){
    return this.getUser().role ==='prof'
  }
}
