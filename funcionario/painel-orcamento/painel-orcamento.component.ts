import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { EfetuarOrcamentoComponent } from '../efetuar-orcamento/efetuar-orcamento.component';

@Component({
  selector: 'app-pag-funcionario',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    EfetuarOrcamentoComponent
  ], 
  templateUrl: './pag-funcionario.component.html',
  styleUrls: ['./pag-funcionario.component.css']
})
export class PagFuncionario implements OnInit {
  // --- VARIÁVEIS DA TELA ---
  nomeUsuario: string = 'Mário';
  loading: boolean = false;
  
  filtro: string = 'SOLICITACOES-ABERTAS';
  dataInicio: string = '';
  dataFim: string = '';
  dataAtual: string = new Date().toISOString().split('T')[0];

  solicitacaoSelecionada: any = null;
  funcionariosDisponiveis: any[] = []; 

  // --- NOVAS VARIÁVEIS DE PAGINAÇÃO ---
  paginaAtual: number = 1;
  itensPorPagina: number = 5;
  totalPaginas: number = 1;
  solicitacoesPaginadas: any[] = []; // Os itens que realmente aparecem na tela

  // --- BANCO DE DADOS SIMULADO (Expandido) ---
  todasSolicitacoes: any[] = [
    { id: 1042, dataHora: '2026-04-27T09:00:00', nomeCliente: 'José Silva', descricaoEquipamento: 'Computador desktop não liga', estado: 'ABERTA' },
    { id: 1043, dataHora: '2026-04-26T14:30:00', nomeCliente: 'Maria Souza', descricaoEquipamento: 'Notebook com tela quebrada', estado: 'ORÇADA' },
    { id: 1044, dataHora: '2026-04-25T10:15:00', nomeCliente: 'Carlos Alves', descricaoEquipamento: 'Impressora falhando impressão', estado: 'APROVADA' },
    { id: 1045, dataHora: '2026-04-24T16:45:00', nomeCliente: 'Ana Santos', descricaoEquipamento: 'Troca de bateria de Nobreak', estado: 'PAGA' },
    { id: 1046, dataHora: '2026-04-23T11:00:00', nomeCliente: 'Roberto Costa', descricaoEquipamento: 'Teclado mecânico falhando', estado: 'FINALIZADA' },
    { id: 1047, dataHora: '2026-04-22T08:20:00', nomeCliente: 'Fernanda Lima', descricaoEquipamento: 'Monitor sem imagem', estado: 'ABERTA' },
    { id: 1048, dataHora: '2026-04-21T13:10:00', nomeCliente: 'Paulo Mendes', descricaoEquipamento: 'SSD não reconhece', estado: 'REDIRECIONADA' }
  ];

  solicitacoesFiltradas: any[] = [];

  constructor(public CDR: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.aplicarFiltro();
  }

  // ==========================================
  // FUNÇÕES DE FILTRO E PAGINAÇÃO (+30 linhas)
  // ==========================================
  
  setFiltro(novoFiltro: string): void {
    this.filtro = novoFiltro;
    this.paginaAtual = 1; // Reseta a página ao mudar o filtro
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    this.loading = true;

    setTimeout(() => {
      if (this.filtro === 'SOLICITACOES-ABERTAS') {
        this.solicitacoesFiltradas = this.todasSolicitacoes.filter(s => s.estado === 'ABERTA');
      } else if (this.filtro === 'TODAS') {
        this.solicitacoesFiltradas = [...this.todasSolicitacoes];
      } else {
        this.solicitacoesFiltradas = [...this.todasSolicitacoes];
      }

      this.atualizarPaginacao();
      this.loading = false;
    }, 400);
  }

  atualizarPaginacao(): void {
    this.totalPaginas = Math.ceil(this.solicitacoesFiltradas.length / this.itensPorPagina);
    const inicio = (this.paginaAtual - 1) * this.itensPorPagina;
    const fim = inicio + this.itensPorPagina;
    this.solicitacoesPaginadas = this.solicitacoesFiltradas.slice(inicio, fim);
  }

  mudarPagina(novaPagina: number, evento: Event): void {
    evento.preventDefault();
    if (novaPagina >= 1 && novaPagina <= this.totalPaginas) {
      this.paginaAtual = novaPagina;
      this.atualizarPaginacao();
    }
  }

  // ==========================================
  // EXPORTAÇÃO PARA CSV (EXCEL) (+25 linhas)
  // ==========================================
  exportarParaCSV(): void {
    if (this.solicitacoesFiltradas.length === 0) {
      alert('Não há dados para exportar.');
      return;
    }

    const cabecalhos = ['ID', 'Data/Hora', 'Cliente', 'Equipamento', 'Estado'];
    const linhas = this.solicitacoesFiltradas.map(s => 
      `${s.id},"${s.dataHora}","${s.nomeCliente}","${s.descricaoEquipamento}","${s.estado}"`
    );

    const csvContent = [cabecalhos.join(','), ...linhas].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `relatorio_solicitacoes_${this.dataAtual}.csv`);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // ==========================================
  // FUNÇÕES VISUAIS E MODAIS
  // ==========================================

  getStatusClass(estado: string): string {
    switch (estado) {
      case 'ABERTA': return 'bg-warning text-dark';
      case 'ORÇADA': return 'bg-info text-dark';
      case 'APROVADA': return 'bg-primary text-white';
      case 'REDIRECIONADA': return 'bg-secondary text-white';
      case 'PAGA': return 'bg-success text-white';
      case 'FINALIZADA': return 'bg-dark text-white';
      default: return 'bg-light text-dark';
    }
  }

  salvarOrcamento(dados: {id: number, valor: number}): void {
    const index = this.todasSolicitacoes.findIndex(s => s.id === dados.id);
    if (index !== -1) {
      this.todasSolicitacoes[index].estado = 'ORÇADA';
      this.todasSolicitacoes[index].valor = dados.valor;
      this.aplicarFiltro(); 
      alert(`Orçamento de R$ ${dados.valor} registrado!`);
    }
    this.solicitacaoSelecionada = null; 
  }

  efetuarManutencao(evento: any): void {
    if (this.solicitacaoSelecionada) {
       this.solicitacaoSelecionada.estado = 'FINALIZADA'; 
       this.aplicarFiltro();
    }
    this.solicitacaoSelecionada = null;
  }

  redirecionar(evento?: any): void {
    if (this.solicitacaoSelecionada) {
       this.solicitacaoSelecionada.estado = 'REDIRECIONADA';
       this.aplicarFiltro();
    }
    this.solicitacaoSelecionada = null;
  }

  finalizar(): void {
    if (this.solicitacaoSelecionada) {
      this.solicitacaoSelecionada.estado = 'FINALIZADA';
      this.solicitacaoSelecionada.dataHoraFinalizacao = new Date();
      this.solicitacaoSelecionada.funcionarioFinalizacao = this.nomeUsuario;
      this.aplicarFiltro();
      this.CDR.detectChanges(); 
    }
    this.solicitacaoSelecionada = null;
  }
}
