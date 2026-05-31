import { Component, Output, EventEmitter, Input, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GetResgateDTO, SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-resgatar-servico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resgatar-servico.html',
  styleUrl: './resgatar-servico.css',
})

export class ResgatarServico implements OnInit {

  @Input() idSolicitacao!: number;
  @Input() solicitacao: any;
  @Output() fechar = new EventEmitter<void>();
  @Output() atualizado = new EventEmitter<any>();

  resgate?: GetResgateDTO;
  loading = false;
  erroCarregamento = '';
  private cdr = inject(ChangeDetectorRef);
  private solicitacaoService = inject(SolicitacaoService);

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

  this.solicitacaoService.buscarResgateCliente(id).subscribe({
    next: (dados) => {
      this.resgate = dados;
      this.loading = false;
      this.cdr.detectChanges();
    },
    error: (erro) => {
      console.error('Erro ao buscar dados de resgate:', erro);
      this.erroCarregamento = 'Não foi possível carregar os dados do resgate.';
      this.loading = false;
      this.cdr.detectChanges();
    },
  });
}

  get valor(): string {
  const valor = this.resgate?.valor ?? 0;

  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
} // busca e formata o valor para resgate do pedido

  //função para voltar para a página anterior
  cancelar() {
    this.fechar.emit(); //dispara o evento de cancelamento, pode usar para fechar o popup ou voltar para a página anterior
  }

  // função para o resgate
  confirmarResgate(): void {
    const id = this.idSolicitacao || this.solicitacao?.id;

    if (!id) {
      return;
    }

    this.solicitacaoService.resgatarSolicitacao(id).subscribe({
      next: () => {
        this.atualizado.emit({
          id,
          backendAtualizado: true,
          estado: 'APROVADA',
          historico: [
            {
              data: new Date(),
              estado: 'APROVADA',
              funcionario: 'Cliente',
            },
          ],
        });

        this.fechar.emit();
      },
      error: (erro) => {
        console.error('Erro ao resgatar solicitacao:', erro);
      },
    });
  }
}
