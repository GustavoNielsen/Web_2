import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Funcionario } from '../shared/models/funcionario.model';

// const LS_CHAVE = 'funcionarios';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {

  private apiUrl = 'http://localhost:8080/funcionarios';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.apiUrl, { withCredentials: true });
  }

  inserir(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.post<Funcionario>(this.apiUrl, funcionario, { withCredentials: true });
  }

  buscarPorId(id: number): Observable<Funcionario> {
    return this.http.get<Funcionario>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  atualizar(funcionario: Funcionario): Observable<Funcionario> {
    return this.http.put<Funcionario>(`${this.apiUrl}/${funcionario.id}`, funcionario, { withCredentials: true });
  }

  remover(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  /**
  listarTodos(): Funcionario[] {
    const funcionarios = localStorage[LS_CHAVE];

    return funcionarios ? JSON.parse(funcionarios) : [];
  }

  inserir(funcionario: Funcionario): void {
    const funcionarios = this.listarTodos();
    funcionario.id = new Date().getTime();
    funcionarios.push(funcionario);
    localStorage[LS_CHAVE] = JSON.stringify(funcionarios);
  }

  buscarPorId(id: number): Funcionario | undefined {
    const funcionarios = this.listarTodos();
    return funcionarios.find((f) => f.id === id);
  }
  
  atualizar(funcionario: Funcionario): void {
    const funcionarios = this.listarTodos();
    funcionarios.forEach( (obj, index, objs) => {
      if(funcionario.id === obj.id){
        objs[index] = funcionario;
      }
    });
    localStorage[LS_CHAVE] = JSON.stringify(funcionarios);
  }

  remover(id: number): void {
    let funcionarios = this.listarTodos();
    funcionarios = funcionarios.filter((f) => f.id !== id);
    localStorage[LS_CHAVE] = JSON.stringify(funcionarios);
  }

  **/
}
