import { Component, Output, EventEmitter } from '@angular/core'; // output é necessário para emitir eventos para o componente pai
import { CommonModule } from '@angular/common'; // Importante para diretivas básicas
import { FormsModule } from '@angular/forms';   // necessário para quando o usuário digitar

@Component({
  selector: 'app-rejeitar-servico',
  standalone: true, 
  imports: [CommonModule, FormsModule], // Adiciona suporte a formulários e funcionalidades básicas
  templateUrl: './rejeitar-servico.html',
  styleUrl: './rejeitar-servico.css',
})

export class RejeitarServico {
  motivoRejeicao: string = ""; // Variável que vai guardar o motivo da rejeição

  @Output() rejeicaoConfirmada = new EventEmitter<string>(); // Output marca a variavel como um evento que pode ser emitido para o componente pai, tambem passa o motivo da rejeição como string
  @Output() rejeicaoCancelada = new EventEmitter<void>(); //EventEmitter é o que deixa o componente emitir eventos, nesse caso não precisa passar nada então é void

  confirmarRejeicao() {
    alert("Serviço rejeiado.");
    console.log("Estado da OS atualizado para Rejeitado");

    this.rejeicaoConfirmada.emit(this.motivoRejeicao); // O emmit é o que dispara o evento, nesse caso ele passa o motivo da rejeição para o componente  pai
  }

  cancelar() {
    alert("Rejeição cancelada.");
    this.rejeicaoCancelada.emit(); //fecha o popup de rejeição
  }

}