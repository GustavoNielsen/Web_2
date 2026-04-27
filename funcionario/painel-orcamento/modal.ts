import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// 1. IMPORTAÇÃO DO NOVO MODAL DE ORÇAMENTO
import { EfetuarOrcamentoComponent } from '../efetuar-orcamento/efetuar-orcamento.component';

// IMPORTANTE: Se os outros modais (Visualizar, Manutenção, etc) estiverem em arquivos separados,
// você precisará importá-los aqui e adicioná--los na lista 'imports' abaixo!

@Component({
  selector: 'app-pag-funcionario',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule, 
    RouterModule,
    EfetuarOrcamentoComponent // Adicionando o modal aqui
  ], 
  templateUrl: './pag-funcionario.component.html',
  styleUrls: ['./pag-funcionario.component.css']
})
export class PagFuncionario implements OnInit {
  // --- VARIÁVEIS DA TELA ---
  nomeUsuario: string = 'Mário';
  loading: boolean = false;
  
  // Variáveis dos Filtros
  filtro: string = 'SOLICITACOES-ABERTAS';
  dataInicio: string = '';
  dataFim: string = '';
  dataAtual: string = new Date().toISOString().split('T')[0]; // Pega a data de hoje formatada

  // Variáveis dos Modais
  solicitacaoSelecionada: any = null;
  funcionariosDisponiveis: any[] = []; 

  // --- BANCO DE DADOS SIMULADO ---
  todasSolicitacoes: any[] = [
    { id: 1042, dataHora: '2026-04-27T09:00:00', nomeCliente: 'José Silva', descricaoEquipamento: 'Computador desktop não liga', estado: 'ABERTA' },
    { id: 1043, dataHora: '2026-04-26T14:30:00', nomeCliente: 'Maria Souza', descricaoEquipamento: 'Notebook com tela quebrada', estado: 'ORÇADA' },
    { id: 1044, dataHora: '2026-04-25T10:15:00', nomeCliente: 'Carlos Alves', descricaoEquipamento: 'Impressora falhando impressão', estado: 'APROVADA' },
    { id: 1045, dataHora: '2026-04-24T16:45:00', nomeCliente: 'Ana Santos', descricaoEquipamento: 'Troca de bateria de Nobreak', estado: 'PAGA' }
  ];

  solicitacoesFiltradas: any[] = [];

  constructor(public CDR: ChangeDetectorRef) {}

  ngOnInit(): void {
    // Inicia a tela já aplicando o filtro padrão (Abertas)
    this.aplicarFiltro();
  }

  // ==========================================
  // FUNÇÕES DE FILTRO E VISUAL
  // ==========================================
  
  setFiltro(novoFiltro: string): void {
    this.filtro = novoFiltro;
    this.aplicarFiltro();
  }

  aplicarFiltro(): void {
    this.loading = true;

    // Simulando o tempo de busca no banco para mostrar o ícone de carregamento
    setTimeout(() => {
      if (this.filtro === 'SOLICITACOES-ABERTAS') {
        this.solicitacoesFiltradas = this.todasSolicitacoes.filter(s => s.estado === 'ABERTA');
      } else if (this.filtro === 'TODAS') {
        this.solicitacoesFiltradas = [...this.todasSolicitacoes];
      } else {
        // Lógica para 'HOJE' e 'PERIODO' (mostra tudo provisoriamente)
        this.solicitacoesFiltradas = [...this.todasSolicitacoes];
      }

      this.loading = false;
    }, 400); // 400 milissegundos de delay
  }

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

  // ==========================================
  // FUNÇÕES DOS MODAIS
  // ==========================================

  // Função disparada pelo Modal de Orçamento
  salvarOrcamento(dados: {id: number, valor: number}): void {
    const index = this.todasSolicitacoes.findIndex(s => s.id === dados.id);
    if (index !== -1) {
      this.todasSolicitacoes[index].estado = 'ORÇADA';
      this.todasSolicitacoes[index].valor = dados.valor;
      
      this.aplicarFiltro(); // Atualiza a tabela
      alert(`Orçamento de R$ ${dados.valor} registrado!`);
    }
    this.solicitacaoSelecionada = null; // Fecha a seleção
  }

  // Função do Modal de Manutenção
  efetuarManutencao(evento: any): void {
    if (this.solicitacaoSelecionada) {
       this.solicitacaoSelecionada.estado = 'FINALIZADA'; 
       this.aplicarFiltro();
    }
    this.solicitacaoSelecionada = null;
  }

  // Função do Modal de Redirecionamento
  redirecionar(evento?: any): void {
    if (this.solicitacaoSelecionada) {
       this.solicitacaoSelecionada.estado = 'REDIRECIONADA';
       this.aplicarFiltro();
    }
    this.solicitacaoSelecionada = null;
  }

  // Função do Modal de Finalizar
  finalizar(): void {
    if (this.solicitacaoSelecionada) {
      this.solicitacaoSelecionada.estado = 'FINALIZADA';
      this.solicitacaoSelecionada.dataHoraFinalizacao = new Date();
      this.solicitacaoSelecionada.funcionarioFinalizacao = this.nomeUsuario;
      
      this.aplicarFiltro();
      this.CDR.detectChanges(); // Força o Angular a desenhar a tela novamente
    }
    this.solicitacaoSelecionada = null;
  }
}
