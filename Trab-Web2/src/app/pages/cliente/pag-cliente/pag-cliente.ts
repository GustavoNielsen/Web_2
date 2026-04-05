import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VisualizarServico } from '../visualizar-servico/visualizar-servico';
import { MostrarServico } from '../mostrar-servico/mostrar-servico';
import { ResgatarServico } from '../resgatar-servico/resgatar-servico';
import { PagarServico } from '../pagar-servico/pagar-servico';


@Component({
  selector: 'app-pag-cliente',
  standalone: true,
  imports: [CommonModule, VisualizarServico, MostrarServico, ResgatarServico, PagarServico],
  templateUrl: './pag-cliente.html',
  styleUrl: './pag-cliente.css',
})
export class PagCliente {

  modal: string = ""
  solicitacaoSelecionada: any = null;

  openModal(modal: string) {
    this.modal = modal
  }

  visualizarServico(id: number, modal: string) {
    this.solicitacaoSelecionada = this.solicitacoes.find(s => s.id === id);
    this.openModal(modal);
  }

  abrirAcao(modal: string) {
    this.closeModal();
    this.openModal(modal);
  }

  atualizarSolicitacao(evento: any) {
    const index = this.solicitacoes.findIndex(s => s.id === evento.id);

    if (index !== -1) {
      this.solicitacoes[index] = {
        ...this.solicitacoes[index],
        estado: evento.estado,
        historico: [
          ...this.solicitacoes[index].historico,
          ...evento.historico
        ]
      };
    }

    this.closeModal();
  }

  closeModal() {
    this.modal = ""
  }
  solicitacoes = [
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
    },
    {
      id: 1004,
      dataHora: new Date('2026-04-01T16:00:00'),
      nomeCliente: 'Joaquina',
      descricaoEquipamento: 'Mouse',
      categoria: 'Periféricos',
      descricaoDefeito: 'Scroll travado e botão esquerdo não funciona.',
      estado: 'APROVADA',
      historico: [
        { data: new Date('2026-04-01T16:00:00'), estado: 'ABERTA', funcionario: 'Sistema' },
        { data: new Date('2026-04-01T17:00:00'), estado: 'ORÇADA', funcionario: 'Maria' },
        { data: new Date('2026-04-02T09:00:00'), estado: 'APROVADA', funcionario: 'Cliente' }
      ]
    },
    {
      id: 1005,
      dataHora: new Date('2026-03-31T08:40:00'),
      nomeCliente: 'Guilherme',
      descricaoEquipamento: 'Teclado',
      categoria: 'Periféricos',
      descricaoDefeito: 'Derramou suco no teclado e agora as teclas "A" e "S" não funcionam.',
      estado: 'APROVADA',
      funcionarioDestino: 'Mário',
      historico: [
        { data: new Date('2026-03-31T08:40:00'), estado: 'ABERTA', funcionario: 'Sistema' },
        { data: new Date('2026-03-31T10:00:00'), estado: 'APROVADA', funcionario: 'Maria', destino: 'Mário' }
      ]
    },
    {
      id: 1006,
      dataHora: new Date('2026-03-30T09:15:00'),
      nomeCliente: 'Gustavo',
      descricaoEquipamento: 'Notebook',
      categoria: 'Notebooks',
      descricaoDefeito: 'Tela trincada e teclado com algumas teclas não funcionando.',
      estado: 'ARRUMADA',
      historico: [
        { data: new Date('2026-03-30T09:15:00'), estado: 'ABERTA', funcionario: 'Sistema' },
        { data: new Date('2026-03-30T11:00:00'), estado: 'ORÇADA', funcionario: 'Mário' },
        { data: new Date('2026-03-30T14:00:00'), estado: 'APROVADA', funcionario: 'Cliente' },
        { data: new Date('2026-03-31T16:00:00'), estado: 'ARRUMADA', funcionario: 'Mário' }
      ]
    },
    {
      id: 1007,
      dataHora: new Date('2026-03-29T08:30:00'),
      nomeCliente: 'Matheus',
      descricaoEquipamento: 'Teclado',
      categoria: 'Monitores',
      descricaoDefeito: 'Fica desconectando do computador.',
      estado: 'PAGA',
      historico: [
        { data: new Date('2026-03-29T08:30:00'), estado: 'ABERTA', funcionario: 'Sistema' },
        { data: new Date('2026-03-29T10:00:00'), estado: 'ORÇADA', funcionario: 'Maria' },
        { data: new Date('2026-03-29T11:00:00'), estado: 'APROVADA', funcionario: 'Cliente' },
        { data: new Date('2026-03-30T09:00:00'), estado: 'ARRUMADA', funcionario: 'Maria' },
        { data: new Date('2026-03-30T10:00:00'), estado: 'PAGA', funcionario: 'Maria' }
      ]
    },
    {
      id: 1008,
      dataHora: new Date('2026-03-28T09:00:00'),
      nomeCliente: 'Eduardo',
      descricaoEquipamento: 'Rebinboca',
      categoria: 'Consoles',
      descricaoDefeito: 'Não liga, possível problema',
      estado: 'FINALIZADA',
      historico: [
        { data: new Date('2026-03-28T09:00:00'), estado: 'ABERTA', funcionario: 'Sistema' },
        { data: new Date('2026-03-28T10:00:00'), estado: 'ORÇADA', funcionario: 'Mário' },
        { data: new Date('2026-03-28T11:00:00'), estado: 'APROVADA', funcionario: 'Cliente' },
        { data: new Date('2026-03-28T15:00:00'), estado: 'ARRUMADA', funcionario: 'Mário' },
        { data: new Date('2026-03-29T09:00:00'), estado: 'PAGA', funcionario: 'Mário' },
        { data: new Date('2026-03-29T10:00:00'), estado: 'FINALIZADA', funcionario: 'Mário' }
      ]
    }
  ];




}
