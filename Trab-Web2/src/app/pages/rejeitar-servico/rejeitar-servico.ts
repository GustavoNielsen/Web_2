import { Component, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importante para diretivas básicas
import { FormsModule } from '@angular/forms';   // necessário para quando o usuário digitar

@Component({
  selector: 'app-rejeitar-servico',
  standalone: true, 
  imports: [CommonModule, FormsModule], // Adiciona suporte a formulários e funcionalidades básicas
  templateUrl: './rejeitar-servico.html',
  styleUrl: './rejeitar-servico.css',
  encapsulation: ViewEncapsulation.None // permite que o bootstrap funcione
})
export class RejeitarServico {
  motivoRejeicao: string = ""; // variável que armazena o motivo que o cliente digitar

  // Exemplo de função que o html pode chamar futuramente para processar a rejeição
  confirmarRejeicao() {
  // verifica se o cliente digitou um motivo de rejeição
  if (this.motivoRejeicao.trim() === "") {
    alert("Por favor, escreva o motivo da rejeição antes de confirmar.");
    return; // Para a execução aqui e não mostra o próximo alert
  }

    // se o cliente digitou um motivo, é feita a rejeição
    alert("Serviço rejeitado!"); // exibe uma mensagem de confirmação para o cliente

    console.log("Serviço rejeitado pelo cliente.");
    console.log("Motivo informado:", this.motivoRejeicao);
    // No futuro aqui vai ter que fazer a chamada para o banco de dados
  }
}