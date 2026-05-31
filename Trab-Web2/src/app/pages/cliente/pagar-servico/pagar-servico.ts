import { Component, EventEmitter, Output, Input, inject } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { StatusFormatPipe } from '../../../shared/pipes/status-format.pipe';
import { SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-pagar-servico',
  standalone: true,
  imports: [CommonModule, StatusFormatPipe],
  templateUrl: './pagar-servico.html',
  styleUrl: './pagar-servico.css',
})

export class PagarServico {

  @Output() fechar = new EventEmitter<void>();
  @Input() idSolicitacao!: number;
  @Input() solicitacao: any;
  @Output() atualizado = new EventEmitter<any>();

  private solicitacaoService= inject(SolicitacaoService);

  perfil: string = 'CLIENTE';


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
