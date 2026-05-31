import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Solicitacao } from '../shared/models/solicitacao.model';

//const LS_CHAVE = 'solicitacoes';

interface SolicitacaoClienteResumoDTO {
  id: number;
  dataCriacao: string;
  descricaoEquipamento: string;
  status: string;
}

interface SolicitacoesClienteResponseDTO {
  solicitacoes: SolicitacaoClienteResumoDTO[];
}

export interface GetOrcamentoClienteDTO {
  idSolicitacao: number;
  descricaoEquipamento: string;
  categoria: string;
  defeito: string;
  dataAbertura: string;
  status: string;
  valor: number;
}

export interface GetPagarDTO {
  descricaoEquipamento: string;
  categoria: string;
  status: string;
  valor: number;
}

export interface GetResgateDTO {
  idSolicitacao: number;
  descricaoEquipamento: string;
  defeito: string;
  status: string;
  valor: number;
}

export interface InformacoesSolicitacaoDTO {
  id: number;
  equipamento: string;
  categoria: string;
  defeito: string;
  motivoRejeicao: string | null;
  status: string;
  dataCriacao: string;
  dataPagamento: string | null;
  dataFinalizacao: string | null;
  orcamento: {
    valor: number;
    dataOrcamento: string;
    funcionario: string;
  } | null;
  manutencao: {
    descricao: string;
    orientacao: string;
    dataManutencao: string;
    funcionario: string;
  } | null;
  historico: Array<{
    status: string;
    data: string;
  }>;
}

export interface SolicitacaoPainelFuncionario {
  id: number;
  dataHora: Date;
  cliente: string;
  equipamento: string;
  estado: string;
  descricao: string;
  categoria: string;
}

@Injectable({
  providedIn: 'root',
})
export class SolicitacaoService {

  private apiUrl = 'http://localhost:8080/solicitacoes';
  private clienteApiUrl = 'http://localhost:8080/api/clientes/solicitacoes';
  private clienteBaseUrl = 'http://localhost:8080/api/clientes';

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<Solicitacao[]> {
    return this.http.get<SolicitacoesClienteResponseDTO>(
      this.clienteApiUrl,
      {
        withCredentials: true
      }
    ).pipe(
      map(response => response.solicitacoes.map(s => this.mapResumoCliente(s)))
    );
  }

  buscarInformacoesCliente(idSolicitacao: number): Observable<InformacoesSolicitacaoDTO> {
    return this.http.get<InformacoesSolicitacaoDTO>(
      `${this.clienteApiUrl}/${idSolicitacao}`,
      { withCredentials: true }
    );
  }

  buscarOrcamentoCliente(idSolicitacao: number): Observable<GetOrcamentoClienteDTO> {
    return this.http.get<GetOrcamentoClienteDTO>(
      `${this.clienteBaseUrl}/orcamento/${idSolicitacao}`,
      { withCredentials: true }
    );
  }

  buscarPagamentoCliente(idSolicitacao: number): Observable<GetPagarDTO> {
    return this.http.get<GetPagarDTO>(
      `${this.clienteBaseUrl}/pagar/${idSolicitacao}`,
      { withCredentials: true }
    );
  }

  buscarResgateCliente(idSolicitacao: number): Observable<GetResgateDTO> {
    return this.http.get<GetResgateDTO>(
      `${this.clienteBaseUrl}/resgatar/${idSolicitacao}`,
      { withCredentials: true }
    );
  }

  buscarInformacoesFuncionario(idSolicitacao: number): Observable<InformacoesSolicitacaoDTO> {
    return this.http.get<InformacoesSolicitacaoDTO>(
      `${this.funcionarioBaseUrl}/solicitacoes/${idSolicitacao}`,
      { withCredentials: true }
    );
  }

  listarCategorias(): Observable<{ id: number; nome: string }[]> {
    return this.http.get<{ id: number; nome: string }[]>(
      'http://localhost:8080/api/clientes/listarcategorias',
      { withCredentials: true }
    );
  }

  rejeitarSolicitacao(idSolicitacao: number, motivo: string): Observable<void> {
    return this.http.put<void>(
      `${this.clienteBaseUrl}/rejeitarsolicitacao`,
      { idSolicitacao, motivo },
      { withCredentials: true }
    );
  }

  aprovarSolicitacao(idSolicitacao: number): Observable<void> {
    return this.http.put<void>(
      `${this.clienteBaseUrl}/aprovarsolicitacao`,
      { idSolicitacao },
      { withCredentials: true }
    );
  }

  resgatarSolicitacao(idSolicitacao: number): Observable<void> {
    return this.http.put<void>(
      `${this.clienteBaseUrl}/resgatar`,
      { idSolicitacao },
      { withCredentials: true }
    );
  }

  pagarSolicitacao(idSolicitacao: number): Observable<void> {
    return this.http.put<void>(
      `${this.clienteBaseUrl}/pagar`,
      { idSolicitacao },
      { withCredentials: true }
    );
  }

  private mapResumoCliente(dto: SolicitacaoClienteResumoDTO): Solicitacao {
    return {
      id: dto.id,
      dataHora: new Date(dto.dataCriacao),
      descricaoEquipamento: dto.descricaoEquipamento,
      estado: dto.status,
      nomeCliente: '',
      email: '',
      cpf: '',
      telefone: '',
      endereco: '',
      categoria: '',
      descricaoDefeito: '',
      historico: [],
    };
  }

  atualizar(solicitacao: Solicitacao): Observable<Solicitacao> {
    return this.http.put<Solicitacao>(
      `${this.apiUrl}/${solicitacao.id}`,
      solicitacao,
      { withCredentials: true }
    );
  }
  // adiciona nova solicitacao
  inserir(solicitacao: Solicitacao): Observable<any> {
    const dto = {
      equipamento: solicitacao.descricaoEquipamento,
      categoria: solicitacao.categoria,
      descricao: solicitacao.descricaoDefeito
    };
    return this.http.post(
      'http://localhost:8080/api/clientes/abrirsolicitacao',
      dto,
      { withCredentials: true }
    );
  }

  //Paginação de funcionario com infinite scroll
  listarPaginado(pagina: number, tamanho: number = 50): Observable<Solicitacao[]> {
    return this.http.get<Solicitacao[]>(
      `${this.apiUrl}?page=${pagina}&size=${tamanho}`,
      { withCredentials: true }
    );
  }

  // Painel de Funcionário - Listar solicitações
  private funcionarioBaseUrl = 'http://localhost:8080/api/funcionarios';

  private mapPainelFuncionario(lista: any[]): SolicitacaoPainelFuncionario[] {
    return (lista || []).map((s) => ({
      id: s.id,
      dataHora: new Date(s.dataCriacao),
      cliente: s.cliente,
      equipamento: s.equipamento,
      estado: s.status,
      descricao: s.descricao,
      categoria: s.categoria,
    }));
  }
  solicitacoesAbertas(pagina: number = 0): Observable<SolicitacaoPainelFuncionario[]> {
    return this.http.get<any[]>(
      `${this.funcionarioBaseUrl}/solicitacaoesAbertas/${pagina}`,
      { withCredentials: true }
    ).pipe(map(lista => this.mapPainelFuncionario(lista)));
  }

  solicitacoesHoje(pagina: number = 0): Observable<SolicitacaoPainelFuncionario[]> {
    return this.http.get<any[]>(
      `${this.funcionarioBaseUrl}/solicitacaoesHoje/${pagina}`,
      { withCredentials: true }
    ).pipe(map(lista => this.mapPainelFuncionario(lista)));
  }

  solicitacoesTotais(pagina: number = 0): Observable<SolicitacaoPainelFuncionario[]> {
    return this.http.get<any[]>(
      `${this.funcionarioBaseUrl}/solicitacaoesTotais/${pagina}`,
      { withCredentials: true }
    ).pipe(map(lista => this.mapPainelFuncionario(lista)));
  }

  solicitacoesPorPeriodo(dataMin: string, dataMax: string, pagina: number = 0): Observable<SolicitacaoPainelFuncionario[]> {
    return this.http.post<any[]>(
      `${this.funcionarioBaseUrl}/solicitacaoPeriodo`,
      { dataMin, dataMax, page: pagina },
      { withCredentials: true }
    ).pipe(map(lista => this.mapPainelFuncionario(lista)));
  }

  orcarSolicitacao(idSolicitacao: number, valor: number): Observable<void> {
    return this.http.put<void>(
      `${this.funcionarioBaseUrl}/orcar`,
      { idSolicitacao, valor },
      { withCredentials: true }
    );
  }

  finalizarSolicitacao(idSolicitacao: number): Observable<void> {
    return this.http.put<void>(
      `${this.funcionarioBaseUrl}/finalizar`,
      { idSolicitacao },
      { withCredentials: true }
    );
  }

  realizarManutencao(idSolicitacao: number, descricao: string, orientacao: string): Observable<void> {
    return this.http.put<void>(
      `${this.funcionarioBaseUrl}/realizarmanutencao`,
      { idSolicitacao, descricao, orientacao },
      { withCredentials: true }
    );
  }

  redirecionarSolicitacao(idSolicitacao: number, funcionarioDestino: number): Observable<void> {
    return this.http.put<void>(
      `${this.funcionarioBaseUrl}/redirecionar`,
      { idSolicitacao, funcionarioDestino },
      { withCredentials: true }
    );
  }

  obterRelatorioCategoria(): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.funcionarioBaseUrl}/relatorio/categoria`,
      { withCredentials: true }
    );
  }

  gerarRelatorioReceitas(dataInicial?: string, dataFinal?: string): Observable<Blob> {
    const params: Record<string, string> = {};

    if (dataInicial) {
      params['dataInicial'] = dataInicial;
    }

    if (dataFinal) {
      params['dataFinal'] = dataFinal;
    }

    return this.http.get(`${this.funcionarioBaseUrl}/relatorio/receitas`, {
      params,
      responseType: 'blob',
      withCredentials: true,
    });
  }

  gerarRelatorioReceitasPorCategoria(): Observable<Blob> {
    return this.http.get(`${this.funcionarioBaseUrl}/relatorio/receitas/categorias`, {
      responseType: 'blob',
      withCredentials: true,
    });
  }

  /**
  
  listarTodos(): Solicitacao[] {
    const solicitacoes = localStorage[LS_CHAVE];
    if (!solicitacoes) {
      return this.carregarSolicitacoesPadrao();
    }
    const lista: Solicitacao[] = JSON.parse(solicitacoes);
    lista.forEach(s => {
      s.dataHora = new Date(s.dataHora);
      if (s.historico) {
        s.historico.forEach(h => {
          h.data = new Date(h.data);
        });
      }
    });
    return lista;
  }

  inserir(solicitacao: Solicitacao): void {
    const solicitacoes = this.listarTodos();

    solicitacao.id = new Date().getTime();
    solicitacao.dataHora = new Date();
    solicitacao.estado = 'ABERTA';

    solicitacao.historico = [
      {
        data: new Date(),
        estado: 'ABERTA',
        funcionario: 'Sistema'
      }
    ];

    solicitacoes.push(solicitacao);
    localStorage[LS_CHAVE] = JSON.stringify(solicitacoes);
  }

  buscarPorId(id: number): Solicitacao | undefined {
    const solicitacoes = this.listarTodos();
    return solicitacoes.find(s => s.id === id);
  }

  atualizar(solicitacao: Solicitacao): void {
    const solicitacoes = this.listarTodos();

    solicitacoes.forEach((obj, index, objs) => {
      if (solicitacao.id === obj.id) {
        objs[index] = solicitacao;
      }
    });

    localStorage[LS_CHAVE] = JSON.stringify(solicitacoes);
  }

  remover(id: number): void {
    let solicitacoes = this.listarTodos();
    solicitacoes = solicitacoes.filter(s => s.id !== id);
    localStorage[LS_CHAVE] = JSON.stringify(solicitacoes);
  }

  private carregarSolicitacoesPadrao(): Solicitacao[] {
    const solicitacoes: Solicitacao[] = [
      {
        id: 1001,
        dataHora: new Date('2026-04-05T09:00:00'),
        nomeCliente: 'João',
        email: 'joao.silva@email.com',
        cpf: '111.222.333-44',
        telefone: '(41) 98888-7777',
        endereco: 'Rua A, 1, Curitiba - PR',
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
        email: 'jose.silva@email.com',
        cpf: '222.333.444-55',
        telefone: '(41) 98888-6666',
        endereco: 'Rua B, 2, Curitiba - PR',
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
        email: 'joana.silva@email.com',
        cpf: '333.444.555-66',
        telefone: '(41) 98888-5555',
        endereco: 'Rua C, 3, Curitiba - PR',
        descricaoEquipamento: 'Impressora HP',
        categoria: 'Impressoras',
        descricaoDefeito: 'Não imprime, luz de erro piscando',
        estado: 'REJEITADA',
        historico: [
          { data: new Date('2026-04-02T10:15:00'), estado: 'ABERTA', funcionario: 'Sistema' },
          { data: new Date('2026-04-02T11:00:00'), estado: 'ORÇADA', funcionario: 'Mário' },
          { data: new Date('2026-04-02T13:00:00'), estado: 'REJEITADA', funcionario: 'Cliente' }
        ]
      }
    ];

    localStorage[LS_CHAVE] = JSON.stringify(solicitacoes);
    return solicitacoes;
  }
  **/
}
