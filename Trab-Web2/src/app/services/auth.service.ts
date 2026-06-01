import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = '/auth';

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

  salvarSessao(response: any): void {
    const username = response?.username ?? response?.nome ?? '';
    const cargo = response?.cargo ?? response?.tipo ?? '';

    localStorage.setItem('username', username);
    localStorage.setItem('cargo', cargo);
  }

  getCargo(): string | null {
    return localStorage.getItem('cargo');
  }

  getUsername(): string {
    return localStorage.getItem('username') || '';
  }

  isLoggedIn(): boolean {
    return !!this.getCargo();
  }

  logout(): void {
    localStorage.removeItem('username');
    localStorage.removeItem('cargo');
  }
}
