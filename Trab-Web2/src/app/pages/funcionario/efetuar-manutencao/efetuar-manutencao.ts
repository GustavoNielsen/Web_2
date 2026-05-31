import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitacaoService } from '../../../services/solicitacao.service';

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
  salvando = false;

  constructor(private solicitacaoService: SolicitacaoService) {}

  limparFormulario(): void {
    this.descricaoManutencao = '';
    this.orientacoesCliente = '';
    this.salvando = false;
  }

  confirmarManutencao() {
    if (this.salvando) {
      return;
    }

    if (!this.solicitacao?.id) {
      alert('Solicitacao invalida.');
      return;
    }

    if (!this.descricaoManutencao || !this.orientacoesCliente) {
      alert('Preencha todos os campos.');
      return;
    }

    this.salvando = true;

    this.solicitacaoService.realizarManutencao(
      this.solicitacao.id,
      this.descricaoManutencao,
      this.orientacoesCliente
    ).subscribe({
      next: () => {
        this.realizarManutencao.emit({
          id: this.solicitacao.id,
          descricao: this.descricaoManutencao,
          orientacao: this.orientacoesCliente
        });

        this.limparFormulario();
      },
      error: (erro) => {
        console.error('Erro ao registrar manutencao:', erro);
        alert('Nao foi possivel registrar a manutencao.');
        this.salvando = false;
      }
    });
  }

  irParaRedirecionar() {
    this.abrirRedirecionar.emit();
  }
}
