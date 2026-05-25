import { CommonModule } from '@angular/common';
import { Component, ViewChild, inject } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Solicitacao } from '../../../shared/models/solicitacao.model';
import { SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-solicitacao-manutencao',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './solicitacao-manutencao.html',
  styleUrl: './solicitacao-manutencao.css',
})

export class SolicitacaoManutencao {
  @ViewChild('formSolicitacao') formulario!: NgForm;

  titulo: string = 'Solicitar manutenção';
  solicitacao: Solicitacao = new Solicitacao();

  private solicitacaoService = inject(SolicitacaoService);
  private router = inject(Router);

  inserir(): void {
  if (this.formulario.form.valid) {
    this.solicitacao.nomeCliente = 'Cliente';
    this.solicitacaoService.inserir(this.solicitacao);

    this.router.navigate(['/cliente/home']);
  }
}
}