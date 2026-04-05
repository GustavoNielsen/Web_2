import { Component, EventEmitter, Input ,Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Funcionario } from '../../../shared/models/funcionario.model';

@Component({
  selector: 'app-redirecionar-solicitcao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './redirecionar-solicitacao.html',
  styleUrl: './redirecionar-solicitacao.css',
})
export class RedirecionarSolicitacao {

  @Input() solicitacao: any; //recebe a solicitação
  @Input() funcionarios: any[] = []; // receba os funcionários

  funcionarioSelecionado: string = ''; //variavek que guarda o funcionário selecionado

  @Output() redirecionado = new EventEmitter<any>(); 
  @Output() cancelado = new EventEmitter<void>(); //evento para quando for cancelado

  confirmarRedirecionamento() {
    if (this.funcionarioSelecionado) {
      const dadosRedirecionamento = {
        funcionarioOrigem: 'Mário', //funcionário logado,como não tem login está fixo
        funcionarioDestino: this.funcionarioSelecionado,
        dataHora: new Date(),
      };
      this.redirecionado.emit(dadosRedirecionamento); //emite o evento com os dados do redirecionamento
      this.funcionarioSelecionado = ''; //limpa a seleção após redirecionar
    }
  }

  cancelarRedirecionamento() {
    this.funcionarioSelecionado = ''; //limpa a seleção
    this.cancelado.emit(); //emite o evento de cancelamento
  }

}
