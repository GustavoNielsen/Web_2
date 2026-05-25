import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { StatusFormatPipe } from '../../../shared/pipes/status-format.pipe';

@Component({
  selector: 'app-visualizar-servico',
  standalone: true,
  imports: [CommonModule, StatusFormatPipe],
  templateUrl: './visualizar-servico.html',
  styleUrl: './visualizar-servico.css',
})

export class VisualizarServico implements OnInit {
  @Input() solicitacao: any;
  loading = true;
  perfil = 'CLIENTE'; // troque para 'CLIENTE' para testar
  historico: any[] = [];
  @Output() fechar = new EventEmitter<void>();
  @Output() acao = new EventEmitter<string>();

  constructor(private router: Router) {}

  ngOnInit() {
  this.historico = this.solicitacao?.historico
    ? [...this.solicitacao.historico]
    : [];

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

  this.solicitacao.estado = novoEstado;

  this.historico = [{
    estadoAnterior: anterior,
    estadoNovo: novoEstado,
    descricao,
    responsavel: responsavel ?? 'Sistema',
    dataHora: new Date(),
  }, ...this.historico];

  // Atualiza a tabela
  this.acao.emit({
    ...this.solicitacao,
    historico: this.historico
  });
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
  acaoCliente(modal: string) {
  this.acao.emit(modal);
}

}