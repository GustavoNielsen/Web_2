import { Component, Output, EventEmitter, Input } from '@angular/core';
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
  @Output() atualizado = new EventEmitter<any>();
  @Input() solicitacao: any;

//função para voltar para a página anterior
  voltar() {
    this.fechar.emit(); //dispara o evento de cancelamento, pode usar para fechar o popup ou voltar para a página anterior
  }

// função exemplo para simular o resgate
  confirmarResgate() {
    this.atualizado.emit({
    id: this.solicitacao.id,
    estado: 'APROVADA',
    historico: [
      {
        data: new Date(),
        estado: 'APROVADA',
        funcionario: 'Cliente'
      }
    ]
  });

  this.fechar.emit();
}
  }

