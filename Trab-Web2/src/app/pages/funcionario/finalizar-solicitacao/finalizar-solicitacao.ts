import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-finalizar-solicitacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './finalizar-solicitacao.html',
  styleUrl: './finalizar-solicitacao.css',
})
export class FinalizarSolicitacao {

  @Input() solicitacao: any; //Recebe a solicitação a ser finalizada
  @Output() finalizada = new EventEmitter<void>(); //emite um evento quando a solicitação é finalizada
  @Output() cancelado = new EventEmitter<void>(); //emite um evento quando o processo é cancelado

  confirmarFinalizacao() {
    console.log(`Solicitação ${this.solicitacao.id} finalizada.`);
    this.finalizada.emit(); //Emiteo evento de finalização
  }

  cancelarFinalizacao() {
    console.log(`Solicitação ${this.solicitacao.id} cancelada.`);
    this.cancelado.emit(); //emite o evento de cancelamento
  }

}