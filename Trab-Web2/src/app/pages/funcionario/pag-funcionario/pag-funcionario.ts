import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FinalizarSolicitacao } from '../finalizar-solicitacao/finalizar-solicitacao';

@Component({
  selector: 'app-pag-funcionario',
  standalone: true,
  imports: [CommonModule, FormsModule, FinalizarSolicitacao],
  templateUrl: './pag-funcionario.html',
  styleUrl: './pag-funcionario.css',
})
export class PagFuncionario implements OnInit {

  nomeUsuario = 'Mário';
  filtro: 'HOJE' | 'TODAS' | 'PERIODO' = 'HOJE';

  dataInicio: string = '';
  dataFim: string = '';
  dataAtual: string = '';

  solicitacaoSelecionada: any = null; //variavel que guarda a s selecionada pra passar pro popup

  loading = false;

  todasSolicitacoes: any[] = [
    {
      id: 1001,
      dataHora: new Date('2026-04-04T09:00:00'),
      nomeCliente: 'João',
      descricaoEquipamento: 'Notebook - Tela quebrada e dobradiça solta',
      estado: 'ABERTA'
    },
    {
      id: 1002,
      dataHora: new Date('2026-04-03T14:30:00'),
      nomeCliente: 'José',
      descricaoEquipamento: 'Desktop - Lentidão extrema, possível problema de HD',
      estado: 'ORÇADA'
    },
    {
      id: 1003,
      dataHora: new Date('2026-04-02T10:15:00'),
      nomeCliente: 'Joana',
      descricaoEquipamento: 'Impressora - Não imprime, luz de erro piscando',
      estado: 'REJEITADA'
    },
    {
      id: 1004,
      dataHora: new Date('2026-04-01T16:00:00'),
      nomeCliente: 'Joaquina',
      descricaoEquipamento: 'Mouse - Scroll travado e clique duplo',
      estado: 'APROVADA'
    },
    {
      id: 1005,
      dataHora: new Date('2026-03-31T08:40:00'),
      nomeCliente: 'Guilherme',
      descricaoEquipamento: 'Teclado - algumas teclas não respondem e outras digitam sozinhas',
      estado: 'REDIRECIONADA'
    },
    {
      id: 1006,
      dataHora: new Date('2026-03-30T09:15:00'),
      nomeCliente: 'Gustavo',
      descricaoEquipamento: 'Notebook - Dobradiça solta',
      estado: 'ARRUMADA'
    },
    {
      id: 1007,
      dataHora: new Date('2026-03-29T08:30:00'),
      nomeCliente: 'Matheus',
      descricaoEquipamento: 'Teclado - Teclas não respondem',
      estado: 'PAGA'
    },
    {
      id: 1008,
      dataHora: new Date('2026-03-28T09:00:00'),
      nomeCliente: 'Eduardo',
      descricaoEquipamento: 'Rebinboca - Não liga, possível problema',
      estado: 'FINALIZADA'
    }

  ];

  solicitacoesFiltradas: any[] = [];

  ngOnInit() {
    this.dataAtual = new Date().toISOString().split('T')[0];
    this.aplicarFiltro();
  }

  setFiltro(f: 'HOJE' | 'TODAS' | 'PERIODO') {
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

      if (this.filtro === 'HOJE') {
      this.solicitacoesFiltradas = this.todasSolicitacoes.filter(s => {
        const dataS = new Date(s.dataHora);
        return dataS.toDateString() === hojeStr;
      });
      } 
      else if (this.filtro === 'PERIODO' && this.dataInicio && this.dataFim) {
        // Converte as strings dos inputs de data para objetos Date
        const dInicio = new Date(this.dataInicio + 'T00:00:00');
        const dFim = new Date(this.dataFim + 'T23:59:59');

        this.solicitacoesFiltradas = this.todasSolicitacoes.filter(s => {
          const dataS = new Date(s.dataHora);
          return dataS >= dInicio && dataS <= dFim;
        });
      } 
      else {
        // Se for 'TODAS' ou período incompleto, mostra tudo
        this.solicitacoesFiltradas = [...this.todasSolicitacoes];
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
    alert('Iniciando Manutenção da OS: ' + id);
    //simulação de mudança de estado
    const os = this.todasSolicitacoes.find(s => s.id === id);
    if(os) os.estado = 'ARRUMADA'; 
    this.aplicarFiltro(); //reaplica o filtro para atualizar a lista exibida
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