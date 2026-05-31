import { Component, EventEmitter, Output, Input } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';
import { StatusFormatPipe } from '../../../shared/pipes/status-format.pipe';

@Component({
  selector: 'app-pagar-servico',
  standalone: true,
  imports: [CommonModule, StatusFormatPipe],
  templateUrl: './pagar-servico.html',
  styleUrl: './pagar-servico.css',
})

export class PagarServico {

  @Output() fechar = new EventEmitter<void>();
  @Input() idSolicitacao!: number;
  @Input() solicitacao: any;
  @Output() atualizado = new EventEmitter<any>();
  perfil: string = 'CLIENTE';


  voltar() {
    this.fechar.emit();
  }

confirmarPagamento(){
  this.atualizado.emit({
    id: this.solicitacao.id,
    estado: 'PAGA',
    dataPagamento: new Date(),
    historico: [
      {
        data: new Date(),
        estado: 'PAGA',
        funcionario: 'Cliente'
      }
    ]
  });

  this.fechar.emit();
}

  irParaOrcamento() {}

  irParaPagamento() {}

  irParaManutencao() {}

  finalizarSolicitacao() {}

  resgatarServico() {}
}
