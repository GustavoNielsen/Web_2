import { Component, OnInit, ChangeDetectorRef} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EfetuarOrcamento } from '../efetuar-orcamento/efetuar-orcamento';
import { FinalizarSolicitacao } from '../finalizar-solicitacao/finalizar-solicitacao';
import { RedirecionarSolicitacao } from '../redirecionar-solicitcao/redirecionar-solicitacao';
import { VisualizarSolicitacao } from '../visualizar-solicitacoes/visualizar-solicitacao';
import { EfetuarManutencao } from '../efetuar-manutencao/efetuar-manutencao';
import { STATUS_SOLICITACAO } from '../../../shared/constants/status.constants';
import { StatusFormatPipe } from '../../../shared/pipes/status-format.pipe';
import { inject } from '@angular/core';
import { SolicitacaoService } from '../../../services/solicitacao.service';
import { FuncionarioService } from '../../../services/funcionario.service';

@Component({
  selector: 'app-pag-funcionario',
  standalone: true,
  imports: [CommonModule, FormsModule, EfetuarOrcamento, FinalizarSolicitacao, RedirecionarSolicitacao, VisualizarSolicitacao, EfetuarManutencao, StatusFormatPipe],
  templateUrl: './pag-funcionario.html',
  styleUrl: './pag-funcionario.css',
})

export class PagFuncionario implements OnInit {

  private solicitacaoService = inject(SolicitacaoService);
  private funcionarioService = inject(FuncionarioService);

  nomeUsuario = '';
  filtro: 'SOLICITACOES-ABERTAS' |'HOJE' | 'TODAS' | 'PERIODO' = 'HOJE';

  dataInicio: string = '';
  dataFim: string = '';
  dataAtual: string = '';

  solicitacaoSelecionada: any = null; //variavel que guarda a s selecionada pra passar pro popup

  paginaAtual = 0;
  carregandoMais = false;
  fimDosDados = false;

  todasSolicitacoes: any[] = [];

  loading = false;

  solicitacoesFiltradas: any[] = []; //variavel que guard solicitações depois do filtro, é a lista exibida

  listaFuncionarios: any[] = []; //lista de funcionários para redirecionamento

  funcionariosDisponiveis: any[] = []; //variavel que guarda funcionários disponiveis para não mostrar o funcionário logado na lista de redirecionamento

  ngOnInit() { //inicializa com as OS abertas
    // Lê o nome do usuário salvo no Login
    this.nomeUsuario = localStorage.getItem('username') || 'Funcionário';

    this.filtro = 'SOLICITACOES-ABERTAS'; 
    this.dataAtual = new Date().toISOString().split('T')[0];
    this.carregarPagina();

  }

  setFiltro(f: 'SOLICITACOES-ABERTAS' | 'HOJE' | 'TODAS' | 'PERIODO') {
    this.filtro = f;
    this.aplicarFiltro();
  } 

  constructor(private CDR: ChangeDetectorRef) {} // CDR é um gatilho que força a atualização da tela em momentos específicos

  aplicarFiltro() {
    this.loading = true;
    this.solicitacoesFiltradas = [];
    this.CDR.detectChanges(); //forca a atualizacão para mostrar o carregamento antes de aplicar o filtro

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
      this.solicitacoesFiltradas = listaBase.filter(s => new Date(s.dataHora).toDateString() === hojeStr);
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
    this.CDR.detectChanges(); // Força a atualização depois do filtro seraplicado //simula um delay de 500ms para mostrar o carregamento
  }

  // Lógica de cores para os Badges padronizada com Constantes
  getStatusClass(status: string): string {
    switch (status) {
      case STATUS_SOLICITACAO.ABERTA: return 'bg-secondary text-white';
      case STATUS_SOLICITACAO.ORCADA: return 'bg-brown text-white';
      case STATUS_SOLICITACAO.REJEITADA: return 'bg-danger text-white';
      case STATUS_SOLICITACAO.APROVADA: return 'bg-warning text-dark';
      case STATUS_SOLICITACAO.REDIRECIONADA: return 'bg-purple text-white';
      case STATUS_SOLICITACAO.EM_MANUTENCAO: return 'bg-info text-dark';
      case STATUS_SOLICITACAO.ARRUMADA: return 'bg-primary text-white';
      case STATUS_SOLICITACAO.PAGA: return 'bg-orange text-white';
      case STATUS_SOLICITACAO.FINALIZADA: return 'bg-success text-white';
      default: return 'bg-dark text-white';
    }
  }

  carregarPagina() {
    // Evita múltiplas chamadas se já estiver carregando ou se chegou no fim
    if (this.carregandoMais || this.fimDosDados) return;
    
    this.carregandoMais = true;
    
    // Chama a API passando a página atual (0, 1, 2...)
    this.solicitacaoService.listarPaginado(this.paginaAtual).subscribe({
      next: (data: any[]) => {
        if (data.length === 0) {
          this.fimDosDados = true; // Se o Java devolver vazio, acabaram as OS
        } else {
          // Pega os dados que já existem na tela e "soma" com os novos que chegaram
          this.todasSolicitacoes = [...this.todasSolicitacoes, ...data];
          this.paginaAtual++; // Prepara para a próxima página
          this.aplicarFiltro(); // Aplica os filtros visuais na nova lista
        }
        this.carregandoMais = false;
      },
      error: (erro) => {
        console.error('Erro ao buscar as solicitações da página:', erro);
        this.carregandoMais = false;
      }
    });
  }

  rolarTabela(event: any) {
    const elemento = event.target;
    // Se a barra de rolagem chegou a 50px do fim, ele pede a próxima página
    if (elemento.scrollHeight - elemento.scrollTop <= elemento.clientHeight + 50) {
      this.carregarPagina();
    }
  }

  efetuarOrcamento(dados: any) {
    if (this.solicitacaoSelecionada) {
      this.loading = true;
      this.CDR.detectChanges();

      // Atualiza os dados no objeto local
      this.solicitacaoSelecionada.estado = 'ORÇADA';
      this.solicitacaoSelecionada.valorOrcamento = dados.valor;
      
      if (!this.solicitacaoSelecionada.historico) {
        this.solicitacaoSelecionada.historico = [];
      }
      
      this.solicitacaoSelecionada.historico.push({
        data: new Date(),
        estado: 'ORÇADA',
        funcionario: this.nomeUsuario
      });

      // Envia a OS atualizada para o Backend via PUT
      this.solicitacaoService.atualizar(this.solicitacaoSelecionada).subscribe({
        next: () => {
          this.aplicarFiltro();
          this.loading = false;
          this.CDR.detectChanges();
        },
        error: (erro: any) => {
          console.error('Erro ao efetuar orçamento no backend:', erro);
          this.loading = false;
          this.CDR.detectChanges();
        }
      });
    }
  }

  efetuarManutencao(dados: any) {
    if (this.solicitacaoSelecionada) {
      this.loading = true;
      this.CDR.detectChanges();

      // Atualiza os dados localmente
      this.solicitacaoSelecionada.estado = 'ARRUMADA';
      this.solicitacaoSelecionada.detalhesManutencao = {
        descricao: dados.descricao,
        orientacoes: dados.orientacoes,
        funcionario: this.nomeUsuario
      };
      
      this.solicitacaoSelecionada.historico.push({
        data: dados.dataHora,
        estado: 'ARRUMADA',
        funcionario: this.nomeUsuario
      });

      // Salva no banco
      this.solicitacaoService.atualizar(this.solicitacaoSelecionada).subscribe({
        next: () => {
          this.aplicarFiltro();
          this.loading = false;
          this.CDR.detectChanges();
          this.solicitacaoSelecionada = null;
        },
        error: (erro: any) => {
          console.error('Erro ao efetuar manutenção no backend:', erro);
          this.loading = false;
          this.CDR.detectChanges();
        }
      });
    }
  }

  redirecionar(dadosRedirecionamento?: any) { 
    if(!dadosRedirecionamento) { 
      // Agora o seu botão escuta a rede, protegendo o modal contra falhas
      this.funcionarioService.listarTodos().subscribe({
        next: (data: any[]) => {
          this.listaFuncionarios = data;
          this.funcionariosDisponiveis = this.listaFuncionarios.filter(f => f.nome !== this.nomeUsuario);
        },
        error: (err: any) => console.error('Erro ao carregar técnicos:', err)
      });
      return; 
    }

    this.loading = true;
    this.CDR.detectChanges(); 

    this.solicitacaoSelecionada.estado = 'REDIRECIONADA';
    this.solicitacaoSelecionada.funcionarioDestino = dadosRedirecionamento.funcionarioDestino;
    this.solicitacaoSelecionada.historico.push({
      data: dadosRedirecionamento.dataHora,
      estado: 'REDIRECIONADA',
      funcionario: dadosRedirecionamento.funcionarioOrigem,
      destino: dadosRedirecionamento.funcionarioDestino
    });

    // Envia o redirecionamento para o backend via PUT
    this.solicitacaoService.atualizar(this.solicitacaoSelecionada).subscribe({
      next: () => {
        this.aplicarFiltro();
        this.loading = false;
        this.CDR.detectChanges(); 
        this.solicitacaoSelecionada = null; 
      },
      error: (erro: any) => {
        console.error('Erro ao redirecionar OS no backend:', erro);
        this.loading = false;
        this.CDR.detectChanges();
      }
    });
  }

  finalizar() {
    if(this.solicitacaoSelecionada) {
      this.loading = true;
      this.CDR.detectChanges(); 

      this.solicitacaoSelecionada.estado = 'FINALIZADA';
      this.solicitacaoSelecionada.historico.push({
        data: new Date(),
        estado: 'FINALIZADA',
        funcionario: this.nomeUsuario
      });

      // Confirma a finalização no banco de dados
      this.solicitacaoService.atualizar(this.solicitacaoSelecionada).subscribe({
        next: () => {
          this.aplicarFiltro();
          this.loading = false;
          this.CDR.detectChanges(); 
          this.solicitacaoSelecionada = null; 
        },
        error: (erro: any) => {
          console.error('Erro ao finalizar OS no backend:', erro);
          this.loading = false;
          this.CDR.detectChanges();
        }
      });
    }
  }

}