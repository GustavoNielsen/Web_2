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
    this.carregarDoBackend();

  }

  setFiltro(f: 'SOLICITACOES-ABERTAS' | 'HOJE' | 'TODAS' | 'PERIODO') {
    this.filtro = f;
    this.carregarDoBackend();
  } 

  constructor(private CDR: ChangeDetectorRef) {} // CDR é um gatilho que força a atualização da tela em momentos específicos

  //Método que busca as solicitações do backend de acordo com o filtro selecionado, e atualiza a tela com os resultados.
  carregarDoBackend() {
    this.loading = true;
    this.solicitacoesFiltradas = [];
    this.CDR.detectChanges();
 
    let chamada;
    if (this.filtro === 'SOLICITACOES-ABERTAS') {
      chamada = this.solicitacaoService.solicitacoesAbertas(0);
    } else if (this.filtro === 'HOJE') {
      chamada = this.solicitacaoService.solicitacoesHoje(0);
    } else if (this.filtro === 'PERIODO') {
      // Só busca quando as duas datas estiverem preenchidas
      if (!this.dataInicio || !this.dataFim) {
        this.loading = false;
        this.CDR.detectChanges();
        return;
      }
      chamada = this.solicitacaoService.solicitacoesPorPeriodo(this.dataInicio, this.dataFim, 0);
    } else {
      // TODAS
      chamada = this.solicitacaoService.solicitacoesTotais(0);
    }
 
    chamada.subscribe({
      next: (data: any[]) => {
        this.solicitacoesFiltradas = data;
        this.loading = false;
        this.CDR.detectChanges();
      },
      error: (erro: any) => {
        console.error('Erro ao buscar as solicitações:', erro);
        this.solicitacoesFiltradas = [];
        this.loading = false;
        this.CDR.detectChanges();
      }
    });
  }

  aplicarFiltro() {
    if (this.filtro === 'PERIODO') {
      this.carregarDoBackend();
    }
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
    // Scroll infinito desativado no modo "filtra no back" (cada aba traz sua página).
    return;
  }
 
  rolarTabela(event: any) {
    // Scroll infinito desativado no modo "filtra no back".
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