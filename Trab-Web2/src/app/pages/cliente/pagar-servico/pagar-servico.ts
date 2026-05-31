import { Component, EventEmitter, Output, Input, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { StatusFormatPipe } from '../../../shared/pipes/status-format.pipe';
import { GetPagarDTO, SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-pagar-servico',
  standalone: true,
  imports: [CommonModule, StatusFormatPipe],
  templateUrl: './pagar-servico.html',
  styleUrl: './pagar-servico.css',
})

export class PagarServico implements OnInit {

  @Output() fechar = new EventEmitter<void>();
  @Input() idSolicitacao!: number;
  @Input() solicitacao: any;
  @Output() atualizado = new EventEmitter<any>();

  private solicitacaoService= inject(SolicitacaoService);

  pagamento?: GetPagarDTO;
  loading = false;
  erroCarregamento = '';
  private cdr = inject(ChangeDetectorRef);

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

  this.solicitacaoService.buscarPagamentoCliente(id).subscribe({
    next: (dados) => {
      this.pagamento = dados;
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: (erro) => {
      console.error('Erro ao buscar dados de pagamento:', erro);
      this.erroCarregamento = 'Não foi possível carregar os dados do pagamento.';
      this.loading = false;
      this.cdr.detectChanges();
    },
  });
}

  get valor(): string {
  const valor = this.pagamento?.valor ?? 0;

  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
} // busca e formata o valor do pagamento

  voltar() {
    this.fechar.emit();
  }

confirmarPagamento(): void {
  const id = this.idSolicitacao || this.solicitacao?.id;

  if (!id) {
    return;
  }

  this.solicitacaoService.pagarSolicitacao(id).subscribe({
    next: () => {
      this.atualizado.emit({
        id,
        backendAtualizado: true,
        estado: 'PAGA',
        dataPagamento: new Date(),
        historico: [
          {
            data: new Date(),
            estado: 'PAGA',
            funcionario: 'Cliente',
          },
        ],
      });

      this.fechar.emit();
    },
    error: (erro) => {
      console.error('Erro ao pagar solicitacao:', erro);
    },
  });
}
}
