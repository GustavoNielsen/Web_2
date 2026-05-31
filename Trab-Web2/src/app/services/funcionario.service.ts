import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Funcionario } from '../shared/models/funcionario.model';

// const LS_CHAVE = 'funcionarios';

@Injectable({
  providedIn: 'root',
})
export class FuncionarioService {

  private apiUrl = 'http://localhost:8080/api/crudfuncionarios';


  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Funcionario[]> {
    return this.http.get<Funcionario[]>(this.apiUrl, { withCredentials: true }).pipe(
      map(lista => lista.map(f => this.mapearDoBackend(f)))
    );
  }


inserir(funcionario: Funcionario): Observable<any> {
    return this.http.post(this.apiUrl, this.mapearParaBackend(funcionario), { withCredentials: true, responseType: 'text' });
  }
 
  buscarPorId(id: number): Observable<Funcionario> {
    return this.http.get<any>(`${this.apiUrl}/${id}`, { withCredentials: true }).pipe(
      map(f => this.mapearDoBackend(f))
    );
  }

  atualizar(funcionario: Funcionario): Observable<any> {
    return this.http.put(`${this.apiUrl}/${funcionario.id}`, this.mapearParaBackend(funcionario), { withCredentials: true, responseType: 'text'});
  }

  remover(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true, responseType: 'text'  });
  }

  private mapearParaBackend(f: Funcionario): any {
    return {
      nome: f.nome,
      email: f.email,
      telefone: '',
      dataNascimento: this.formatarData(f.nasc)
    };
  }

  private mapearDoBackend(f: any): Funcionario {
    const func = new Funcionario();
    func.id = f.id;
    func.nome = f.nome;
    func.email = f.email;
    func.nasc = f.dataNascimento ? String(f.dataNascimento).substring(0, 10) : '';
    return func;
  }

    private formatarData(nasc: any): string {
    if (!nasc) return '';
    if (typeof nasc === 'string') {
      return nasc.length >= 10 ? nasc.substring(0, 10) : nasc;
    }
    const d = new Date(nasc);
    const ano = d.getFullYear();
    const mes = String(d.getMonth() + 1).padStart(2, '0');
    const dia = String(d.getDate()).padStart(2, '0');
    return `${ano}-${mes}-${dia}`;
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
