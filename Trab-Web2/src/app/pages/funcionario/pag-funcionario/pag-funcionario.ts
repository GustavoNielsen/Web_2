import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinalizarSolicitacao } from '../finalizar-solicitacao/finalizar-solicitacao';
import { RedirecionarSolicitacao } from '../redirecionar-solicitcao/redirecionar-solicitacao';
import { VisualizarSolicitacao } from '../visualizar-solicitacoes/visualizar-solicitacao';

@Component({
  selector: 'app-pag-funcionario',
  standalone: true,
  imports: [CommonModule, FormsModule, FinalizarSolicitacao, RedirecionarSolicitacao, VisualizarSolicitacao],
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
      descricaoEquipamento: 'Notebook - Tela quebrada e dobradiça solta',
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
      descricaoEquipamento: 'Desktop - Lentidão extrema, possível problema de HD',
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
      descricaoEquipamento: 'Impressora - Não imprime, luz de erro piscando',
      categoria: 'Impressoras',
      descricaoDefeito: 'Não imprime em preto, apenas colorido. Já feito limpeza de cabeçote.',
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
      descricaoEquipamento: 'Mouse - Scroll travado e clique duplo',
      categoria: 'Periféricos',
      descricaoDefeito: 'Botão esquerdo com clique duplo intermitente.',
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
      descricaoEquipamento: 'Teclado - algumas teclas não respondem e outras digitam sozinhas',
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
      descricaoEquipamento: 'Notebook - Dobradiça solta',
      categoria: 'Notebooks',
      descricaoDefeito: 'Dobradiça fazendo barulho de estalo ao abrir.',
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
      descricaoEquipamento: 'Teclado - Teclas não respondem',
      categoria: 'Monitores',
      descricaoDefeito: 'Listras verticais coloridas aparecendo no centro da tela.',
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
      descricaoEquipamento: 'Rebinboca - Não liga, possível problema',
      categoria: 'Consoles',
      descricaoDefeito: 'Superaquecimento e desligamento repentino após 30 min de jogo.',
      estado: 'FINALIZADA',
      historico: [
        { data: new Date('2026-03-28T09:00:00'), estado: 'ABERTA', funcionario: 'Sistema' },
        { data: new Date('2026-03-28T10:00:00'), estado: 'ORÇADA', funcionario: 'Mário' },
        { data: new Date('2026-03-28T11:00:00'), estado: 'APROVADA', funcionario: 'Cliente' },
        { data: new Date('2026-03-28T15:00:00'), estado: 'ARRUMADA', funcionario: 'Mário' },
        { data: new Date('2026-03-29T09:00:00'), estado: 'PAGA', funcionario: 'Mário' },
        { data: new Date('2026-03-29T10:00:00'), estado: 'FINALIZADA', funcionario: 'Mário' }
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

  efetuarOrcamento(id: number) {
    alert('Abrindo tela de Orçamento para OS: ' + id);
  }

  efetuarManutencao(id: number) {
    //simulação de mudança de estado
    const os = this.todasSolicitacoes.find(s => s.id === id); //encontra a OS na lista completa
    if(os) os.estado = 'ARRUMADA'; //altera o estado da OS para arrumada
    this.aplicarFiltro(); //reaplica o filtro para atualizar a lista exibida
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