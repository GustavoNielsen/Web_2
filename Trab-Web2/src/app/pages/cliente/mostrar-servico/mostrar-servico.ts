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
  estado: string = '';

  @Output() fechar = new EventEmitter<void>();
  @Output() atualizado = new EventEmitter<any>();
  @Input() solicitacao: any;

  get valor(): string {
    const valor = this.solicitacao?.valorOrcamento;

    return valor.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }


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
        funcionario: 'Cliente',
        observacao: `Serviço aprovado no valor ${this.valor}`
      }
    ]
  });

  this.fechar.emit();
  }

  rejeicaoAtualizada(evento: any) {
  this.atualizado.emit(evento);
  this.fechar.emit();
}
  closeModal(){
    this.estado = ""
  }

}
