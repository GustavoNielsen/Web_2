import { Injectable } from '@angular/core';
import { Solicitacao } from '../shared/models/solicitacao.model';

const LS_CHAVE = 'solicitacoes';

@Injectable({
  providedIn: 'root',
})
export class SolicitacaoService {

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
}