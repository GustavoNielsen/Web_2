import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-finalizar-solicitacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finalizar-solicitacao.html',
  styleUrl: './finalizar-solicitacao.css',
})
export class FinalizarSolicitacao {

  @Input() solicitacao: any;
  @Output() finalizada = new EventEmitter<any>();
  @Output() cancelado = new EventEmitter<void>();

  salvando = false;

  constructor(private solicitacaoService: SolicitacaoService) {}

  confirmarFinalizacao() {
    if (this.salvando) {
      return;
    }

    if (!this.solicitacao?.id) {
      alert('Solicitacao invalida.');
      return;
    }

    this.salvando = true;

    this.solicitacaoService.finalizarSolicitacao(this.solicitacao.id).subscribe({
      next: () => {
        this.finalizada.emit({ id: this.solicitacao.id });
        this.salvando = false;
      },
      error: (erro) => {
        console.error('Erro ao finalizar solicitacao:', erro);
        alert('Nao foi possivel finalizar a solicitacao.');
        this.salvando = false;
      }
    });
  }

  cancelarFinalizacao() {
    this.cancelado.emit();
  }
}
