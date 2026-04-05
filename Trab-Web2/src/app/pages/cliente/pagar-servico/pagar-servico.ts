import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule, DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-pagar-servico',
  standalone: true,
  imports: [CommonModule, DatePipe, CurrencyPipe],
  templateUrl: './pagar-servico.html',
  styleUrl: './pagar-servico.css',
})
export class PagarServico {

  @Output() fechar = new EventEmitter<void>();
  perfil: string = 'CLIENTE';

  solicitacao: any = {
    id: 0,
    estado: '',
    descricaoEquipamento: '',
    categoria: '',
    descricaoDefeito: '',
    dataHora: new Date(),

    valorOrcamento: null,
    funcionarioOrcamento: '',
    dataOrcamento: new Date(),

    descricaoManutencao: '',
    orientacoesCliente: '',
    funcionarioManutencao: '',
    dataManutencao: new Date(),

    cliente: {
      nome: '',
      email: '',
      cpf: '',
      telefone: '',
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      estado: '',
      cep: ''
    }
  };

  historico: any[] = [];

  voltar() {
    this.fechar.emit();
  }

  irParaOrcamento() {}

  irParaPagamento() {}

  irParaManutencao() {}

  finalizarSolicitacao() {}

  resgatarServico() {}
}