import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinalizarSolicitacao } from '../finalizar-solicitacao/finalizar-solicitacao';
import { RedirecionarSolicitacao } from '../redirecionar-solicitcao/redirecionar-solicitacao';
import { VisualizarSolicitacao } from '../visualizar-solicitacoes/visualizar-solicitacao';
import { EfetuarManutencao } from '../efetuar-manutencao/efetuar-manutencao';

@Component({
  selector: 'app-pag-funcionario',
  standalone: true,
  imports: [CommonModule, FormsModule, FinalizarSolicitacao, RedirecionarSolicitacao, VisualizarSolicitacao, EfetuarManutencao],
  templateUrl: './pag-funcionario.html',
  styleUrl: './pag-funcionario.css',
})
export class PagFuncionario implements OnInit {

  nomeUsuario = 'Mário';
  filtro: 'SOLICITACOES-ABERTAS' |'HOJE' | 'TODAS' | 'PERIODO' = 'HOJE';

  dataInicio: string = '';
  dataFim: string = '';
  dataAtual: string = '';

  solicitacaoSelecionada: any = null; //variavel que guarda a s selecionada pra passar pro popup

  loading = false;

  todasSolicitacoes: any[] = [
    {
      id: 1001,
      dataHora: new Date('2026-04-05T09:00:00'),
      nomeCliente: 'João',
      descricaoEquipamento: 'Notebook positivo',
      categoria: 'Notebooks',
      descricaoDefeito: 'Tela quebrada após queda e dobradiça esquerda solta.',
      estado: 'ABERTA',
      historico: [
        { data: new Date('2026-04-05T09:00:00'), estado: 'ABERTA', funcionario: 'Sistema' }
      ]
    },
    {
      id: 1002,
      dataHora: new Date('2026-04-03T14:30:00'),
      nomeCliente: 'José',
      descricaoEquipamento: 'Computador desktop',
      categoria: 'Desktops',
      descricaoDefeito: 'Lentidão extrema, demora 10 minutos para iniciar o Windows.',
      estado: 'ORÇADA',
      historico: [
        { data: new Date('2026-04-03T14:30:00'), estado: 'ABERTA', funcionario: 'Sistema' },
        { data: new Date('2026-04-03T16:00:00'), estado: 'ORÇADA', funcionario: 'Maria' }
      ]
    },
    {
      id: 1003,
      dataHora: new Date('2026-04-02T10:15:00'),
      nomeCliente: 'Joana',
      descricaoEquipamento: 'Impressora HP',
      categoria: 'Impressoras',
      descricaoDefeito: 'Não imprime, luz de erro piscando',
      estado: 'REJEITADA',
      historico: [
        { data: new Date('2026-04-02T10:15:00'), estado: 'ABERTA', funcionario: 'Sistema' },
        { data: new Date('2026-04-02T11:00:00'), estado: 'ORÇADA', funcionario: 'Mário' },
        { data: new Date('2026-04-02T13:00:00'), estado: 'REJEITADA', funcionario: 'Cliente' }
      ]
    },
    {
      id: 1004,
      dataHora: new Date('2026-04-01T16:00:00'),
      nomeCliente: 'Joaquina',
      descricaoEquipamento: 'Mouse',
      categoria: 'Periféricos',
      descricaoDefeito: 'Scroll travado e botão esquerdo não funciona.',
      estado: 'APROVADA',
      historico: [
        { data: new Date('2026-04-01T16:00:00'), estado: 'ABERTA', funcionario: 'Sistema' },
        { data: new Date('2026-04-01T17:00:00'), estado: 'ORÇADA', funcionario: 'Maria' },
        { data: new Date('2026-04-02T09:00:00'), estado: 'APROVADA', funcionario: 'Cliente' }
      ]
    },
    {
      id: 1005,
      dataHora: new Date('2026-03-31T08:40:00'),
      nomeCliente: 'Guilherme',
      descricaoEquipamento: 'Teclado',
      categoria: 'Periféricos',
      descricaoDefeito: 'Derramou suco no teclado e agora as teclas "A" e "S" não funcionam.',
      estado: 'REDIRECIONADA',
      funcionarioDestino: 'Mário',
      historico: [
        { data: new Date('2026-03-31T08:40:00'), estado: 'ABERTA', funcionario: 'Sistema' },
        { data: new Date('2026-03-31T10:00:00'), estado: 'REDIRECIONADA', funcionario: 'Maria', destino: 'Mário' }
      ]
    },
    {
      id: 1006,
      dataHora: new Date('2026-03-30T09:15:00'),
      nomeCliente: 'Gustavo',
      descricaoEquipamento: 'Notebook',
      categoria: 'Notebooks',
      descricaoDefeito: 'Tela trincada e teclado com algumas teclas não funcionando.',
      estado: 'ARRUMADA',
      historico: [
        { data: new Date('2026-03-30T09:15:00'), estado: 'ABERTA', funcionario: 'Sistema' },
        { data: new Date('2026-03-30T11:00:00'), estado: 'ORÇADA', funcionario: 'Mário' },
        { data: new Date('2026-03-30T14:00:00'), estado: 'APROVADA', funcionario: 'Cliente' },
        { data: new Date('2026-03-31T16:00:00'), estado: 'ARRUMADA', funcionario: 'Mário' }
      ]
    },
    {
      id: 1007,
      dataHora: new Date('2026-03-29T08:30:00'),
      nomeCliente: 'Matheus',
      descricaoEquipamento: 'Teclado',
      categoria: 'Monitores',
      descricaoDefeito: 'Fica desconectando do computador.',
      estado: 'PAGA',
      historico: [
        { data: new Date('2026-03-29T08:30:00'), estado: 'ABERTA', funcionario: 'Sistema' },
        { data: new Date('2026-03-29T10:00:00'), estado: 'ORÇADA', funcionario: 'Maria' },
        { data: new Date('2026-03-29T11:00:00'), estado: 'APROVADA', funcionario: 'Cliente' },
        { data: new Date('2026-03-30T09:00:00'), estado: 'ARRUMADA', funcionario: 'Maria' },
        { data: new Date('2026-03-30T10:00:00'), estado: 'PAGA', funcionario: 'Maria' }
      ]
    },
    {
      id: 1008,
      dataHora: new Date('2026-03-28T09:00:00'),
      nomeCliente: 'Eduardo',
      descricaoEquipamento: 'Rebinboca',
      categoria: 'Consoles',
      descricaoDefeito: 'Não liga, possível problema',
      estado: 'FINALIZADA',
      historico: [
        { data: new Date('2026-03-28T09:00:00'), estado: 'ABERTA', funcionario: 'Sistema' },
        { data: new Date('2026-03-28T10:00:00'), estado: 'ORÇADA', funcionario: 'Mário' },
        { data: new Date('2026-03-28T11:00:00'), estado: 'APROVADA', funcionario: 'Cliente' },
        { data: new Date('2026-03-28T15:00:00'), estado: 'ARRUMADA', funcionario: 'Mário' },
        { data: new Date('2026-03-29T09:00:00'), estado: 'PAGA', funcionario: 'Mário' },
        { data: new Date('2026-03-29T10:00:00'), estado: 'FINALIZADA', funcionario: 'Mário' }
      ]
    },
    {
      id: 1009,
      dataHora: new Date('2026-04-13T09:00:00'),
      nomeCliente: 'Alfredo',
      descricaoEquipamento: 'Notebook',
      categoria: 'Notebooks',
      descricaoDefeito: 'Desliga depois de ligar',
      estado: 'FINALIZADA',
      historico: [
        { data: new Date('2026-03-28T09:00:00'), estado: 'ABERTA', funcionario: 'Sistema' },
        { data: new Date('2026-03-28T10:00:00'), estado: 'ORÇADA', funcionario: 'Maria' },
        { data: new Date('2026-03-28T11:00:00'), estado: 'APROVADA', funcionario: 'Cliente' },
        { data: new Date('2026-03-28T15:00:00'), estado: 'ARRUMADA', funcionario: 'Maria' },
        { data: new Date('2026-03-29T09:00:00'), estado: 'PAGA', funcionario: 'Maria' },
        { data: new Date('2026-03-29T10:00:00'), estado: 'FINALIZADA', funcionario: 'Maria' }
      ]
    },
    {
      id: 1010,
      dataHora: new Date('2026-04-27T16:00:00'),
      nomeCliente: 'Monica',
      descricaoEquipamento: 'Notebook',
      categoria: 'Notebooks',
      descricaoDefeito: 'Liga e desliga em sequência',
      estado: 'ABERTA',
      historico: [
        { data: new Date('2026-03-28T09:00:00'), estado: 'ABERTA', funcionario: 'Sistema' },
      ]
    }
  ];

  solicitacoesFiltradas: any[] = []; //variavel que guard solicitações depois do filtro, é a lista exibida

  listaFuncionarios: any[] = [ //lista de funcionários para redirecionamento
    { id: 1, nome: 'Maria' },
    { id: 2, nome: 'Mário' }
  ];

  funcionariosDisponiveis: any[] = []; //variavel que guarda funcionários disponiveis para não mostrar o funcionário logado na lista de redirecionamento

  ngOnInit() { //inicializa com as OS abertas
    this.filtro = 'SOLICITACOES-ABERTAS';
    this.aplicarFiltro();
    this.dataAtual = new Date().toISOString().split('T')[0];

  }

  setFiltro(f: 'SOLICITACOES-ABERTAS' | 'HOJE' | 'TODAS' | 'PERIODO') {
    this.filtro = f;
    this.aplicarFiltro();
  } 

  constructor(private CDR: ChangeDetectorRef) {} // CDR é um gatilho que força a atualização da tela em momentos específicos
  filterTimer: any; // variável para armazenar o timer do filtro

  aplicarFiltro() {
    if(this.filterTimer) { //se existir um timer ele é excluido pra ficar só 1
      clearTimeout(this.filterTimer);
    }

    this.loading = true;
    this.solicitacoesFiltradas = [];
    this.CDR.detectChanges(); //forca a atualizacão para mostrar o carregamento antes de aplicar o filtro

    this.filterTimer = setTimeout(() => { //simula um processamento demorado do filtro
      const hojeStr = new Date().toDateString(); //string com a data de hoje sem hora, usada para comparar apenas a data

      let listaBase = this.todasSolicitacoes.filter(s => { //filtra as solicitações redirecionadas deacordo com o usuario
        if (s.estado === 'REDIRECIONADA') {
          return s.funcionarioDestino === this.nomeUsuario; //mostra as redirecionadas com o funcionário destino igual ao usuario logado
        }
        return true;
      });

      if (this.filtro === 'SOLICITACOES-ABERTAS') { //filtro para mostrar apenas as solicitações abertas
        this.solicitacoesFiltradas = listaBase.filter(s => s.estado === 'ABERTA');
      }
      else if (this.filtro === 'HOJE') {
        this.solicitacoesFiltradas = listaBase.filter(s =>
          new Date(s.dataHora).toDateString() === hojeStr
        );
      } 
      else if (this.filtro === 'PERIODO' && this.dataInicio && this.dataFim) {
        // Converte as strings dos inputs de data para objetos Date
        const dataInicio = new Date(this.dataInicio + 'T00:00:00');
        const dataFim = new Date(this.dataFim + 'T23:59:59');

        this.solicitacoesFiltradas = listaBase.filter(s => {
          const dataSolicitacao = new Date(s.dataHora);
          return dataSolicitacao >= dataInicio && dataSolicitacao <= dataFim;
        });
      } 
      else {
        // Se for 'TODAS' ou período incompleto, mostra tudo
        this.solicitacoesFiltradas = [...listaBase];
      }

      this.loading = false;
      this.CDR.detectChanges(); // Força a atualização depois do filtro seraplicado
    }, 500); //simula um delay de 500ms para mostrar o carregamento
  }

  // Lógica de cores para os Badges
  getStatusClass(status: string): string {
    switch (status) {
      case 'ABERTA': return 'bg-secondary text-white';
      case 'ORÇADA': return 'bg-brown text-white';
      case 'REJEITADA': return 'bg-danger text-white';
      case 'APROVADA': return 'bg-warning text-dark';
      case 'REDIRECIONADA': return 'bg-purple text-white';
      case 'ARRUMADA': return 'bg-primary text-white';
      case 'PAGA': return 'bg-orange text-white';
      case 'FINALIZADA': return 'bg-success text-white';
      default: return 'bg-dark text-white';
    }
  }

  visualizar(id: number) {
    alert('Visualizando detalhes da OS: ' + id);
  }

  efetuarOrcamento(solicitacao: any) {
    this.loading = true;
    this.CDR.detectChanges();

    setTimeout(() => {
      solicitacao.estado = 'ORÇADA';

      if (!solicitacao.historico) {
        solicitacao.historico = [];
      }
      
      solicitacao.historico.push({
        data: new Date(),
        estado: 'ORÇADA',
        funcionario: this.nomeUsuario
      });

      this.aplicarFiltro();
      this.loading = false;
      this.CDR.detectChanges();
    }, 500);
  }

  efetuarManutencao(dados: any) {
    if (this.solicitacaoSelecionada) {
      this.loading = true;
      this.CDR.detectChanges();

      setTimeout(() => {
        //muda o estado
        this.solicitacaoSelecionada.estado = 'ARRUMADA';
        
        //Salva os dados  da manutenção
        this.solicitacaoSelecionada.detalhesManutencao = {
          descricao: dados.descricao,
          orientacoes: dados.orientacoes,
          funcionario: this.nomeUsuario
        };

        //ADICIONA NO HISTÓRICO (Para o RF008 que acabamos de fazer!)
        this.solicitacaoSelecionada.historico.push({
          data: dados.dataHora,
          estado: 'ARRUMADA',
          funcionario: this.nomeUsuario
        });

        this.aplicarFiltro();
        this.loading = false;
        this.CDR.detectChanges();
        this.solicitacaoSelecionada = null;
      },500);
    }
  }

  redirecionar(dadosRedirecionamento?: any) {
    if(!dadosRedirecionamento) {
      this.funcionariosDisponiveis = this.listaFuncionarios.filter(f => f.nome !== this.nomeUsuario); //filtra a lista de funcionarios para não mostrar o funcionário logado
      return;
    }

      this.loading = true;
      this.CDR.detectChanges(); //força a atualização para mostrar o carregamento antes de finalizar

      setTimeout(() => {
        this.solicitacaoSelecionada.estado = 'REDIRECIONADA';

        this.solicitacaoSelecionada.historicoRedirecionamento = {
        origem: dadosRedirecionamento.funcionarioOrigem,
        destino: dadosRedirecionamento.funcionarioDestino,
        data: dadosRedirecionamento.dataHora };

        this.aplicarFiltro();
        this.loading = false;
        this.CDR.detectChanges();
        this.solicitacaoSelecionada = null;

      },500);
  }

  finalizar() {
    if(this.solicitacaoSelecionada) {
      this.loading = true;
      this.CDR.detectChanges(); //força a atualização para mostrar o carregamento antes de finalizar

        setTimeout(() => { //simula carreagamento pra finalizar a OS
          this.solicitacaoSelecionada.estado = 'FINALIZADA';
          this.solicitacaoSelecionada.dataHoraFinalizacao = new Date();
          this.solicitacaoSelecionada.funcionarioFinalizacao = this.nomeUsuario;

          this.aplicarFiltro();
          this.loading = false;
          this.CDR.detectChanges(); //força a atualização para mostrar a OS finalizada
          this.solicitacaoSelecionada = null; //limpa a seleção
        },500); //delay para mostrar o carregamento
      }
  }

}