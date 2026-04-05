import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visualizar-servico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visualizar-servico.html',
  styleUrl: './visualizar-servico.css',
})
export class VisualizarServico implements OnInit {
  @Input() id: number = 0;
  loading = true;
  perfil = 'CLIENTE'; // troque para 'CLIENTE' para testar
  solicitacao: any = null;
  historico: any[] = [];
  @Output() fechar = new EventEmitter<void>();

  constructor(private router: Router) {}

  ngOnInit() {

  const dados: any = {
    1: {
      id: 1,
      estado: 'ORÇADA',
      descricaoEquipamento: 'Notebook Lenovo',
      categoria: 'Notebook',
      descricaoDefeito: 'Não liga',
      dataHora: "03/08/2026 09:00",
      cliente: { nome: 'João' }
    },
    2: {
      id: 2,
      estado: 'APROVADA',
      descricaoEquipamento: 'Teclado Logitech',
      categoria: 'Teclado',
      descricaoDefeito: 'Led queimado',
      dataHora: new Date(),
      cliente: { nome: 'Joana' }
    },
    3: {
      id: 3,
      estado: 'REJEITADA',
      descricaoEquipamento: 'Impressora HP',
      categoria: 'Impressora',
      descricaoDefeito: 'Falha impressão',
      dataHora: new Date(),
      cliente: { nome: 'Cliente 4' }
    },
    4: {
      id: 4,
      estado: 'ARRUMADA',
      descricaoEquipamento: 'Desktop Gamer',
      categoria: 'Computador',
      descricaoDefeito: 'Superaquecimento',
      dataHora: new Date(),
      cliente: { nome: 'Cliente 5' }
    }
  };

  this.solicitacao = dados[this.id];

  this.historico = [{
    estadoAnterior: null,
    estadoNovo: this.solicitacao.estado,
    descricao: 'Solicitação carregada.',
    responsavel: 'Sistema',
    dataHora: new Date()
  }];

  this.loading = false;
}

  getStatusClass(estado: string) {
    const map: any = {
      'ABERTA': 's-aberta', 'ORÇADA': 's-orcada', 'REJEITADA': 's-rejeitada',
      'APROVADA': 's-aprovada', 'REDIRECIONADA': 's-redirecionada',
      'ARRUMADA': 's-arrumada', 'PAGA': 's-paga', 'FINALIZADA': 's-finalizada',
    };
    return map[estado] ?? '';
  }

  getInitials(nome: string) {
    return nome.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  }

  voltar() {
    this.fechar.emit();
  }

  private mudar(novoEstado: string, descricao: string, responsavel?: string) {
    const anterior = this.solicitacao.estado;
    this.solicitacao = { ...this.solicitacao, estado: novoEstado };
    this.historico = [{
      estadoAnterior: anterior,
      estadoNovo: novoEstado,
      descricao,
      responsavel: responsavel ?? 'Sistema',
      dataHora: new Date(),
    }, ...this.historico];
  }

  // Ações do FUNCIONARIO
  efetuarOrcamento() {
    this.solicitacao = { ...this.solicitacao, valorOrcamento: 350, funcionarioOrcamento: 'Carlos Técnico', dataOrcamento: new Date() };
    this.mudar('ORÇADA', 'Orçamento realizado.', 'Carlos Técnico');
  }

  efetuarManutencao() {
    this.solicitacao = {
      ...this.solicitacao,
      descricaoManutencao: 'Substituição da placa de vídeo e limpeza interna.',
      orientacoesCliente: 'Evitar quedas. Retornar em caso de reincidência.',
      funcionarioManutencao: 'Carlos Técnico',
      dataManutencao: new Date(),
    };
    this.mudar('ARRUMADA', 'Manutenção concluída.', 'Carlos Técnico');
  }

  finalizarSolicitacao() {
    this.mudar('FINALIZADA', 'Solicitação finalizada.', 'Carlos Técnico');
  }

  // Ações do CLIENTE
  aprovarOrcamento() {
    this.mudar('APROVADA', 'Orçamento aprovado pelo cliente.', this.solicitacao.cliente.nome);
  }

  rejeitarOrcamento() {
    this.mudar('REJEITADA', 'Orçamento rejeitado pelo cliente.', this.solicitacao.cliente.nome);
  }

  resgatarServico() {
    this.mudar('ABERTA', 'Solicitação resgatada pelo cliente.', this.solicitacao.cliente.nome);
  }

  pagar() {
    this.mudar('PAGA', 'Pagamento realizado.', this.solicitacao.cliente.nome);
  }
}