import { Component, Input,Output, EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-efetuar-manutencao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './efetuar-manutencao.html',
  styleUrl: './efetuar-manutencao.css',
})
export class EfetuarManutencao {
  @Input() solicitacao: any;
  @Output() realizarManutencao = new EventEmitter<any>();
  @Output() abrirRedirecionar = new EventEmitter<void>();
  @Output() cancelado = new EventEmitter<void>();

  descricaoManutencao: string = '';
  orientacoesCliente: string = '';

  confirmarManutencao() {
    if (this.descricaoManutencao && this.orientacoesCliente) {
      this.realizarManutencao.emit({
        descricao: this.descricaoManutencao,
        orientacoes: this.orientacoesCliente,
        dataHora: new Date()
      });
      this.descricaoManutencao = ''; //limpa os campos depois deenviar
      this.orientacoesCliente = '';
    } else {
      alert('Preencha todos os campos.');
    }
  }

  irParaRedirecionar() {
    this.abrirRedirecionar.emit();
  }

}
