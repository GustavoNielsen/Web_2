import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { VisualizarServico } from '../visualizar-servico/visualizar-servico';
import { MostrarServico } from '../mostrar-servico/mostrar-servico';
import { ResgatarServico } from '../resgatar-servico/resgatar-servico';
import { PagarServico } from '../pagar-servico/pagar-servico';
import { Solicitacao } from '../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../services/solicitacao.service';

type ColunaOrdenacao = 'dataHora' | 'descricaoEquipamento' | 'estado';

@Component({
  selector: 'app-pag-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule, VisualizarServico, MostrarServico, ResgatarServico, PagarServico],
  templateUrl: './pag-cliente.html',
  styleUrl: './pag-cliente.css',
})
export class PagCliente implements OnInit {

  private solicitacaoService = inject(SolicitacaoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);


  modal: string = '';
  solicitacaoSelecionada: any = null;
  colunaOrdenacao: ColunaOrdenacao | '' = '';
  direcaoOrdenacao: 'asc' | 'desc' = 'asc';

  solicitacoes: Solicitacao[] = [];

  ngOnInit(): void {
    this.solicitacoes = this.solicitacaoService.listarTodos().sort((a, b) => 
      new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
    );

    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('id'));

      if (id) {
        this.abrirModalVisualizarPorId(id);
      }
    });
  }

  openModal(modal: string) {
    this.modal = modal;
  }

  abrirModalVisualizarPorId(id: number): void {
    this.solicitacaoSelecionada = this.solicitacoes.find(s => s.id === id);

    if (!this.solicitacaoSelecionada) {
      alert('Solicitação não encontrada.');
      this.router.navigate(['/cliente/home']);
      return;
    }

    this.modal = 'visualizar';
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
      if (!evento) {
    this.closeModal();
    return;
  }

    const index = this.solicitacoes.findIndex(s => s.id === evento.id);

     if (index !== -1) {
    this.solicitacoes[index] = {
      ...this.solicitacoes[index],
      ...evento,
      historico: [
        ...(this.solicitacoes[index].historico || []),
        ...(evento.historico || [])
      ]
    };

      this.solicitacaoService.atualizar(this.solicitacoes[index]);
    }

    this.closeModal();
  }

  ordenarPor(coluna: ColunaOrdenacao) {
    if (this.colunaOrdenacao === coluna) {
      this.direcaoOrdenacao = this.direcaoOrdenacao === 'asc' ? 'desc' : 'asc';
    } else {
      this.colunaOrdenacao = coluna;
      this.direcaoOrdenacao = 'asc';
    }

    this.solicitacoes.sort((a, b) => {
      let valorA: string | number = a[coluna] instanceof Date
        ? a[coluna].getTime()
        : a[coluna].toLowerCase();

      let valorB: string | number = b[coluna] instanceof Date
        ? b[coluna].getTime()
        : b[coluna].toLowerCase();

      if (valorA < valorB) return this.direcaoOrdenacao === 'asc' ? -1 : 1;
      if (valorA > valorB) return this.direcaoOrdenacao === 'asc' ? 1 : -1;
      return 0;
    });
  }

  closeModal(): void {
    this.modal = '';
  this.solicitacaoSelecionada = null;
  this.router.navigate(['/cliente/home']);
  }
}