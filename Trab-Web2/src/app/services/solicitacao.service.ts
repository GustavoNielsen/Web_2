import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Solicitacao } from '../shared/models/solicitacao.model';

//const LS_CHAVE = 'solicitacoes';

@Injectable({
  providedIn: 'root',
})
export class SolicitacaoService {

  private apiUrl = 'http://localhost:8080/solicitacoes'; 

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(
      this.apiUrl,
      {
        withCredentials: true 
      }
    );
  }

  atualizar(solicitacao: Solicitacao): Observable<Solicitacao> {
    return this.http.put<Solicitacao>(
      `${this.apiUrl}/${solicitacao.id}`, 
      solicitacao,
      { withCredentials: true }
    );
  }

  inserir(solicitacao: Solicitacao): Observable<Solicitacao> {
    return this.http.post<Solicitacao>(
      this.apiUrl, 
      solicitacao, 
      { withCredentials: true }
    );
  }

  /**
  
  listarTodos(): Solicitacao[] {
    const solicitacoes = localStorage[LS_CHAVE];
    if (!solicitacoes) {
      return this.carregarSolicitacoesPadrao();
    }
    const lista: Solicitacao[] = JSON.parse(solicitacoes);
    lista.forEach(s => {
      s.dataHora = new Date(s.dataHora);
      if (s.historico) {
        s.historico.forEach(h => {
          h.data = new Date(h.data);
        });
      }
    });
    return lista;
  }

  inserir(solicitacao: Solicitacao): void {
    const solicitacoes = this.listarTodos();

    solicitacao.id = new Date().getTime();
    solicitacao.dataHora = new Date();
    solicitacao.estado = 'ABERTA';

    solicitacao.historico = [
      {
        data: new Date(),
        estado: 'ABERTA',
        funcionario: 'Sistema'
      }
    ];

    solicitacoes.push(solicitacao);
    localStorage[LS_CHAVE] = JSON.stringify(solicitacoes);
  }

  buscarPorId(id: number): Solicitacao | undefined {
    const solicitacoes = this.listarTodos();
    return solicitacoes.find(s => s.id === id);
  }

  atualizar(solicitacao: Solicitacao): void {
    const solicitacoes = this.listarTodos();

    solicitacoes.forEach((obj, index, objs) => {
      if (solicitacao.id === obj.id) {
        objs[index] = solicitacao;
      }
    });

    localStorage[LS_CHAVE] = JSON.stringify(solicitacoes);
  }

  remover(id: number): void {
    let solicitacoes = this.listarTodos();
    solicitacoes = solicitacoes.filter(s => s.id !== id);
    localStorage[LS_CHAVE] = JSON.stringify(solicitacoes);
  }

  private carregarSolicitacoesPadrao(): Solicitacao[] {
    const solicitacoes: Solicitacao[] = [
      {
        id: 1001,
        dataHora: new Date('2026-04-05T09:00:00'),
        nomeCliente: 'João',
        email: 'joao.silva@email.com',
        cpf: '111.222.333-44',
        telefone: '(41) 98888-7777',
        endereco: 'Rua A, 1, Curitiba - PR',
        descricaoEquipamento: 'Notebook positivo',
        categoria: 'Notebooks',
        descricaoDefeito: 'Tela quebrada após queda e dobradiça esquerda solta.',
        estado: 'ABERTA',
        historico: [
          { data: new Date('2026-04-05T09:00:00'), estado: 'ABERTA', funcionario: 'Sistema' }
        ]
      },
      {
        id: 1002,
        dataHora: new Date('2026-04-03T14:30:00'),
        nomeCliente: 'José',
        email: 'jose.silva@email.com',
        cpf: '222.333.444-55',
        telefone: '(41) 98888-6666',
        endereco: 'Rua B, 2, Curitiba - PR',
        descricaoEquipamento: 'Computador desktop',
        categoria: 'Desktops',
        descricaoDefeito: 'Lentidão extrema, demora 10 minutos para iniciar o Windows.',
        estado: 'ORÇADA',
        historico: [
          { data: new Date('2026-04-03T14:30:00'), estado: 'ABERTA', funcionario: 'Sistema' },
          { data: new Date('2026-04-03T16:00:00'), estado: 'ORÇADA', funcionario: 'Maria' }
        ]
      },
      {
        id: 1003,
        dataHora: new Date('2026-04-02T10:15:00'),
        nomeCliente: 'Joana',
        email: 'joana.silva@email.com',
        cpf: '333.444.555-66',
        telefone: '(41) 98888-5555',
        endereco: 'Rua C, 3, Curitiba - PR',
        descricaoEquipamento: 'Impressora HP',
        categoria: 'Impressoras',
        descricaoDefeito: 'Não imprime, luz de erro piscando',
        estado: 'REJEITADA',
        historico: [
          { data: new Date('2026-04-02T10:15:00'), estado: 'ABERTA', funcionario: 'Sistema' },
          { data: new Date('2026-04-02T11:00:00'), estado: 'ORÇADA', funcionario: 'Mário' },
          { data: new Date('2026-04-02T13:00:00'), estado: 'REJEITADA', funcionario: 'Cliente' }
        ]
      }
    ];

    localStorage[LS_CHAVE] = JSON.stringify(solicitacoes);
    return solicitacoes;
  }
  **/
}