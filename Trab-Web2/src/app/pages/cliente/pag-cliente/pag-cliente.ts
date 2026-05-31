import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { combineLatest } from 'rxjs';
import { VisualizarServico } from '../visualizar-servico/visualizar-servico';
import { MostrarServico } from '../mostrar-servico/mostrar-servico';
import { ResgatarServico } from '../resgatar-servico/resgatar-servico';
import { RejeitarServico } from '../rejeitar-servico/rejeitar-servico';
import { PagarServico } from '../pagar-servico/pagar-servico';
import { Solicitacao } from '../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../services/solicitacao.service';
import { StatusFormatPipe } from '../../../shared/pipes/status-format.pipe';

type ColunaOrdenacao = 'dataHora' | 'descricaoEquipamento' | 'estado';
type ModalCliente = 'visualizar' | 'orcamento' | 'rejeitar' | 'resgatar' | 'pagamento' | null;
type AcaoCliente = 'orcamento' | 'resgatar' | 'pagamento';

@Component({
  selector: 'app-pag-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule, VisualizarServico, MostrarServico, ResgatarServico, RejeitarServico, PagarServico, StatusFormatPipe],
  templateUrl: './pag-cliente.html',
  styleUrl: './pag-cliente.css',
})
export class PagCliente implements OnInit {

  private solicitacaoService = inject(SolicitacaoService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);
  


  modal: ModalCliente = null;
  solicitacaoSelecionada: Solicitacao | null = null;
  colunaOrdenacao: ColunaOrdenacao | '' = '';
  direcaoOrdenacao: 'asc' | 'desc' = 'asc';
  private rotaAtual: { id: number; modal: ModalCliente } = { id: 0, modal: null };

  solicitacoes: Solicitacao[] = [];

  ngOnInit(): void {
    this.carregarSolicitacoes();

  combineLatest([
    this.route.paramMap,
    this.route.data,
  ]).subscribe(([params, data]) => {
    const id = Number(params.get('id'));
    const modal = data['modal'] as ModalCliente;

    this.rotaAtual = { id, modal };
    this.atualizarModalPelaRota(id, modal);
    });
  }


  
private atualizarModalPelaRota(id: number, modal: ModalCliente): void {
  this.modal = null;
  this.solicitacaoSelecionada = null;

  if (!modal) {
    return;
  }

  if (!id) {
    this.router.navigate(['/cliente/home']);
    return;
  }

  if (this.solicitacoes.length === 0) {
    return;
  }

  const solicitacao = this.solicitacoes.find(
    s => Number(s.id) === Number(id)
  );

  if (!solicitacao) {
    alert('Solicitação não encontrada.');
    this.router.navigate(['/cliente/home']);
    return;
  }

  this.solicitacaoSelecionada = solicitacao;
  this.modal = modal;
}

abrirAcaoPorRota(acao: AcaoCliente): void { //Acao feito dentro do modal visualizarserviço
  if (!this.solicitacaoSelecionada) {
    return;
  }

  if (acao === 'orcamento') {
    this.irParaOrcamento(this.solicitacaoSelecionada);
    return;
  }

  if (acao === 'resgatar') {
    this.irParaResgatar(this.solicitacaoSelecionada);
    return;
  }

  if (acao === 'pagamento') {
    this.irParaPagamento(this.solicitacaoSelecionada);
  }
}
  private carregarSolicitacoes(): void {
    this.solicitacaoService.listarTodos().subscribe({
    next: (data: Solicitacao[]) => {
      this.solicitacoes = [...data].sort((a, b) =>
        b.dataHora.getTime() - a.dataHora.getTime()
      );
      this.atualizarModalPelaRota(this.rotaAtual.id, this.rotaAtual.modal);
      this.cdr.detectChanges();
    },
    error: (erro) => {
      console.error('Erro ao buscar as solicitações da API:', erro);
    }
  });
}

  atualizarSolicitacao(evento: Partial<Solicitacao> & { id: number; backendAtualizado?: boolean }): void {
    if (!evento) {
      this.fecharModal();
      return;
    }

    const index = this.solicitacoes.findIndex(
      s => Number(s.id) === Number(evento.id)
    );

    if (index !== -1) {
      this.solicitacoes[index] = {
        ...this.solicitacoes[index],
        ...evento,
        historico: [
          ...(this.solicitacoes[index].historico || []),
          ...((evento as any).historico || []),
        ],
      };

      if (evento.backendAtualizado) {
        this.fecharModal();
        this.carregarSolicitacoes();
        return;
      }

      this.solicitacaoService.atualizar(this.solicitacoes[index]).subscribe({
        next: () => {
          console.log('Status da Ordem de Serviço atualizado no Banco de Dados!');
        },
        error: (erro) => {
          console.error('Erro ao tentar atualizar a OS no backend:', erro);
        }
      });
    }

    this.fecharModal();
  }

private abrirModal(solicitacao: Solicitacao, modal: Exclude<ModalCliente, null>): void {
  this.solicitacaoSelecionada = solicitacao;
  this.modal = modal;
  this.cdr.detectChanges();
}

irParaVisualizar(solicitacao: Solicitacao): void {
  this.abrirModal(solicitacao, 'visualizar');
}

irParaOrcamento(solicitacao: Solicitacao): void {
  this.abrirModal(solicitacao, 'orcamento');
}

irParaRejeitar(solicitacao: Solicitacao): void {
  this.abrirModal(solicitacao, 'rejeitar');
}

irParaResgatar(solicitacao: Solicitacao): void {
  this.abrirModal(solicitacao, 'resgatar');
}

irParaPagamento(solicitacao: Solicitacao): void {
  this.abrirModal(solicitacao, 'pagamento');
}

fecharModal(): void {
  this.modal = null;
  this.solicitacaoSelecionada = null;
  this.router.navigate(['/cliente/home']);
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

  
}
