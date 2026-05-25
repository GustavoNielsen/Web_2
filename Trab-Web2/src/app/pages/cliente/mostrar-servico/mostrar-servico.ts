import { Component, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Solicitacao } from '../../../shared/models/solicitacao.model';

@Component({
  selector: 'app-mostrar-servico',
  imports: [CommonModule],
  standalone: true,
  templateUrl: './mostrar-servico.html',
  styleUrl: './mostrar-servico.css',
})

export class MostrarServico {
   @Input() solicitacao!: Solicitacao;

  @Output() fechar = new EventEmitter<void>();
  @Output() atualizado = new EventEmitter<any>();
  @Output() rejeitar = new EventEmitter<void>();

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
    this.atualizado.emit({
      id: this.solicitacao.id,
      estado: 'APROVADA',
      historico: [
        {
          data: new Date(),
          estado: 'APROVADA',
          funcionario: 'Cliente',
          observacao: `Serviço aprovado no valor ${this.valor}`,
        },
      ],
    });

    this.fechar.emit();
  }
}
