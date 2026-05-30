import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/auth';

  constructor(private http: HttpClient) {}

  registrar(dados: any): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/registrar`,
      dados,
      {
        headers: { 'Content-Type': 'application/json' }
      }
    );
  }

  login(email: string, password: string): Observable<any> {

    return this.http.post(
      `${this.apiUrl}/login`,
      {
        email,
        password
      },
      {
        withCredentials: true
      }
    );
  }
}