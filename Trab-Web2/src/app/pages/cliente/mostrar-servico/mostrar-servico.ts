import { Component, Output, EventEmitter, Input, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Solicitacao } from '../../../shared/models/solicitacao.model';
import { SolicitacaoService, GetOrcamentoClienteDTO } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-mostrar-servico',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './mostrar-servico.html',
  styleUrl: './mostrar-servico.css',
})

export class MostrarServico implements OnInit {
   @Input() idSolicitacao!: number;
   @Input() solicitacao!: Solicitacao;

  @Output() fechar = new EventEmitter<void>();
  @Output() atualizado = new EventEmitter<any>();
  @Output() rejeitar = new EventEmitter<void>();

  private solicitacaoService = inject(SolicitacaoService);
  private cdr = inject(ChangeDetectorRef);
  orcamento?: GetOrcamentoClienteDTO;
  loading = false;
  erroCarregamento = '';
  

  ngOnInit(): void {
  const id = this.idSolicitacao || this.solicitacao?.id;

  if (!id) {
    this.erroCarregamento = 'Solicitação sem ID.';
    this.loading = false;
    this.cdr.detectChanges();
    return;
  }

  this.loading = true;
  this.erroCarregamento = '';
  this.cdr.detectChanges();

  this.solicitacaoService.buscarOrcamentoCliente(id).subscribe({
    next: (dados) => {
      this.orcamento = dados;
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: (erro) => {
      console.error('Erro ao buscar orçamento:', erro);
      this.erroCarregamento = 'Não foi possível carregar os dados do orçamento.';
      this.loading = false;
      this.cdr.detectChanges();
    },
  });

  this.loading = true;

}

  get valor(): string {
    const valor = this.orcamento?.valor ?? 0;

    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  }

  voltar(): void {
    this.fechar.emit();
  }

  redirecionarParaRejeicao(): void {
    this.rejeitar.emit();
  }

  aprovarServico(): void {
  const id = this.idSolicitacao || this.solicitacao?.id;

  if (!id) {
    return;
  }

  this.solicitacaoService.aprovarSolicitacao(id).subscribe({
    next: () => {
      alert(`Serviço Aprovado no Valor ${this.valor}`);

      this.atualizado.emit({
        id,
        backendAtualizado: true,
        estado: 'APROVADA',
        historico: [
          {
            data: new Date(),
            estado: 'APROVADA',
            funcionario: 'Cliente',
            observacao: `Servico aprovado no valor ${this.valor}`,
          },
        ],
      });

      this.fechar.emit();
    },
    error: (erro) => {
      console.error('Erro ao aprovar solicitacao:', erro);
    },
  });
}
}
