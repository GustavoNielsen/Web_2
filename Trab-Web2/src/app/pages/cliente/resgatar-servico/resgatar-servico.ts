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

  @Input() solicitacao: any;
  @Output() fechar = new EventEmitter<void>();
  @Output() atualizado = new EventEmitter<any>();

//função para voltar para a página anterior
  cancelar() {
    this.fechar.emit(); //dispara o evento de cancelamento, pode usar para fechar o popup ou voltar para a página anterior
  }

// função para o resgate
  confirmarResgate() {
    const dadosResgate = {
      id: this.solicitacao.id,
      estado: 'APROVADA',
      historico: [{
        data: new Date(),
        estado: 'APROVADA',
        funcionario: 'Cliente'
      }]
    };

    this.atualizado.emit(dadosResgate); 
    this.fechar.emit();
  }
}
