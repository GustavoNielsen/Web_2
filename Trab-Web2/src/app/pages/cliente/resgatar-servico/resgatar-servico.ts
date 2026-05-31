import { Component, Output, EventEmitter, Input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-resgatar-servico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resgatar-servico.html',
  styleUrl: './resgatar-servico.css',
})

export class ResgatarServico {

  @Input() idSolicitacao!: number;
  @Input() solicitacao: any;
  @Output() fechar = new EventEmitter<void>();
  @Output() atualizado = new EventEmitter<any>();

  private solicitacaoService= inject(SolicitacaoService);

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
