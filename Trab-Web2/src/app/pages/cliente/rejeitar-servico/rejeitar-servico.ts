import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Solicitacao } from '../../../shared/models/solicitacao.model';

@Component({
  selector: 'app-rejeitar-servico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './rejeitar-servico.html',
  styleUrl: './rejeitar-servico.css',
})
export class RejeitarServico {
  motivoRejeicao = '';

  @Input() solicitacao!: Solicitacao;

  @Output() fechar = new EventEmitter<void>();
  @Output() atualizado = new EventEmitter<any>();

  confirmarRejeicao(): void {
    this.atualizado.emit({
      id: this.solicitacao.id,
      estado: 'REJEITADA',
      motivoRejeicao: this.motivoRejeicao,
      historico: [
        {
          data: new Date(),
          estado: 'REJEITADA',
          funcionario: 'Cliente',
          observacao: `Serviço rejeitado. Motivo: ${this.motivoRejeicao}`,
        },
      ],
    });
  }

  cancelar(): void {
    this.fechar.emit();
  }
}