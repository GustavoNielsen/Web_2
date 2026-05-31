import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Categoria } from '../shared/models/categoria.model';

//const LS_CHAVE = 'categorias';  

@Injectable({
  providedIn: 'root',
})
export class CategoriasService {

  private apiUrl = 'http://localhost:8080/api/categorias';

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Categoria[]> {
    return this.http.get<Categoria[]>(this.apiUrl, { withCredentials: true });
  }

  inserir(categoria: Categoria): Observable<Categoria> {
    return this.http.post<Categoria>(this.apiUrl, categoria, { withCredentials: true });
  }

  buscarPorId(id: number): Observable<Categoria> {
    return this.http.get<Categoria>(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  atualizar(categoria: Categoria): Observable<Categoria> {
    return this.http.put<Categoria>(`${this.apiUrl}/${categoria.id}`, categoria, { withCredentials: true });
  }

  remover(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { withCredentials: true });
  }

  /**
  listarTodos(): Categoria[] {
    const categorias = localStorage[LS_CHAVE];
    return categorias ? JSON.parse(categorias) : [];
  }

  inserir(categoria: Categoria): void {
    const categorias = this.listarTodos();
    categoria.id = new Date().getTime();
    categorias.push(categoria);
    localStorage[LS_CHAVE] = JSON.stringify(categorias);
  }

  buscarPorId(id: number): Categoria | undefined {
    const categorias = this.listarTodos();
    return categorias.find((c) => c.id === id);
  }
  
  atualizar(categoria: Categoria): void {
    const categorias = this.listarTodos();
    categorias.forEach( (obj, index, objs) => {
      if(categoria.id === obj.id){
        objs[index] = categoria;
      }
    });
    localStorage[LS_CHAVE] = JSON.stringify(categorias);
  }

  remover(id: number): void {
    let categorias = this.listarTodos();
    categorias = categorias.filter((c) => c.id !== id);
    localStorage[LS_CHAVE] = JSON.stringify(categorias);
  }
    **/
}
