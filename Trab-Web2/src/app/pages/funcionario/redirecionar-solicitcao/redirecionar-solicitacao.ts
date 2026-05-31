import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-redirecionar-solicitcao',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './redirecionar-solicitacao.html',
  styleUrl: './redirecionar-solicitacao.css',
})
export class RedirecionarSolicitacao {

  @Input() solicitacao: any;
  @Input() funcionarios: any[] = [];

  funcionarioSelecionado: number | null = null;
  salvando = false;

  @Output() redirecionado = new EventEmitter<any>();
  @Output() cancelado = new EventEmitter<void>();

  constructor(private solicitacaoService: SolicitacaoService) {}

  confirmarRedirecionamento() {
    if (this.salvando) {
      return;
    }

    if (!this.solicitacao?.id) {
      alert('Solicitacao invalida.');
      return;
    }

    if (!this.funcionarioSelecionado) {
      alert('Selecione um tecnico.');
      return;
    }

    const funcionarioDestino = this.funcionarios.find(f => Number(f.id) === Number(this.funcionarioSelecionado));

    this.salvando = true;

    this.solicitacaoService.redirecionarSolicitacao(
      this.solicitacao.id,
      Number(this.funcionarioSelecionado)
    ).subscribe({
      next: () => {
        this.redirecionado.emit({
          id: this.solicitacao.id,
          funcionarioDestinoId: Number(this.funcionarioSelecionado),
          funcionarioDestinoNome: funcionarioDestino?.nome ?? ''
        });
        this.funcionarioSelecionado = null;
        this.salvando = false;
      },
      error: (erro) => {
        console.error('Erro ao redirecionar solicitacao:', erro);
        alert('Nao foi possivel redirecionar a solicitacao.');
        this.salvando = false;
      }
    });
  }

  cancelarRedirecionamento() {
    this.funcionarioSelecionado = null;
    this.salvando = false;
    this.cancelado.emit();
  }
}
