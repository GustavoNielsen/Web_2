import { Component, Output, EventEmitter, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Solicitacao } from '../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-mostrar-servico',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './mostrar-servico.html',
  styleUrl: './mostrar-servico.css',
})

export class MostrarServico {
   @Input() idSolicitacao!: number;
   @Input() solicitacao!: Solicitacao;

  @Output() fechar = new EventEmitter<void>();
  @Output() atualizado = new EventEmitter<any>();
  @Output() rejeitar = new EventEmitter<void>();

  private solicitacaoService = inject(SolicitacaoService);

  get valor(): string {
    const valor = this.solicitacao?.valorOrcamento ?? 0;

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
