import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-resgatar-servico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './resgatar-servico.html',
  styleUrl: './resgatar-servico.css',
})
export class ResgatarServico {

  @Output() resgateConfirmado = new EventEmitter<void>(); // Output para emitir um evento de confirmação de resgate
  @Output() fechar = new EventEmitter<void>(); //Emiti um evento de cancelamento de resgate

//função para voltar para a página anterior
  voltar() {
    this.fechar.emit(); //dispara o evento de cancelamento, pode usar para fechar o popup ou voltar para a página anterior
  }

// função exemplo para simular o resgate
  confirmarResgate() {
    window.location.href = '/cliente/home'; //dispara o evento de confirmação,pode usar para fechar o popup ou atualizar a página
  }

}