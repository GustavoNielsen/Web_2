import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Solicitacao } from '../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-rejeitar-servico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rejeitar-servico.html',
  styleUrl: './rejeitar-servico.css',
})
export class RejeitarServico {
  motivoRejeicao = '';
  loading = false;
  erro = '';

  @Input() idSolicitacao!: number;
  @Input() solicitacao!: Solicitacao;

  @Output() fechar = new EventEmitter<void>();
  @Output() atualizado = new EventEmitter<any>();

  constructor(private solicitacaoService: SolicitacaoService) {}

  confirmarRejeicao(): void {
    const id = this.idSolicitacao || this.solicitacao?.id;
    const motivo = this.motivoRejeicao.trim();

    if (!id || !motivo) {
      this.erro = 'Informe o motivo da rejeicao.';
      return;
    }

    this.loading = true;
    this.erro = '';

    this.solicitacaoService.rejeitarSolicitacao(id, motivo).subscribe({
      next: () => {
        alert('Servico Rejeitado');
        this.atualizado.emit({
          id,
          backendAtualizado: true,
          estado: 'REJEITADA',
          motivoRejeicao: motivo,
          historico: [
            {
              data: new Date(),
              estado: 'REJEITADA',
              funcionario: 'Cliente',
              observacao: `Servico rejeitado. Motivo: ${motivo}`,
            },
          ],
        });
      },
      error: (erro) => {
        console.error('Erro ao rejeitar solicitacao:', erro);
        this.erro = 'Nao foi possivel rejeitar o servico.';
        this.loading = false;
      },
    });
  }

  cancelar(): void {
    this.fechar.emit();
  }
}
