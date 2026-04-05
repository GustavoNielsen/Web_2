import { Component, Output, EventEmitter, Input } from '@angular/core';
import { AprovarServico } from '../aprovar-servico/aprovar-servico';
import { RejeitarServico } from '../rejeitar-servico/rejeitar-servico';

@Component({
  selector: 'app-mostrar-servico',
  imports: [AprovarServico, RejeitarServico],
  standalone: true,
  templateUrl: './mostrar-servico.html',
  styleUrl: './mostrar-servico.css',
})
export class MostrarServico {
  estado : string = ""
  valor : string = "R$ 525,00"
  @Output() fechar = new EventEmitter<void>();
  @Output() atualizado = new EventEmitter<any>();
  @Input() solicitacao: any;


  voltar(){
    this.fechar.emit();
  }

  redirecionarParaRejeicao(){
    this.estado = "rejeitar"
  }

  aprovarServico(){
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

  closeModal(){
    this.estado = ""
  }

}
