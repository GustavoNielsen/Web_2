import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { InformacoesSolicitacaoDTO, SolicitacaoService } from '../../../services/solicitacao.service';
import { StatusFormatPipe } from '../../../shared/pipes/status-format.pipe';

type AcaoCliente = 'orcamento' | 'resgatar' | 'pagamento';

@Component({
  selector: 'app-visualizar-servico',
  standalone: true,
  imports: [CommonModule, StatusFormatPipe],
  templateUrl: './visualizar-servico.html',
  styleUrl: './visualizar-servico.css',
})
export class VisualizarServico implements OnChanges, OnInit {
  @Input() idSolicitacao!: number;
  @Input() solicitacao: any;

  @Output() fechar = new EventEmitter<void>();
  @Output() acao = new EventEmitter<AcaoCliente>();
  @Output() atualizado = new EventEmitter<any>();

  detalhes?: InformacoesSolicitacaoDTO;
  erroCarregamento = '';
  historico: Array<{ status: string; data: Date; funcionario?: string; observacao?: string }> = [];
  loading = true;
  perfil = 'CLIENTE';
  private idCarregado?: number;

  constructor(
    private solicitacaoService: SolicitacaoService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.carregarDetalhes();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['solicitacao'] || changes['idSolicitacao']) {
      this.historico = this.normalizarHistorico(this.solicitacao?.historico ?? []);
      this.carregarDetalhes();
    }
  }

  get id(): number | undefined {
    return this.detalhes?.id ?? this.solicitacao?.id;
  }

  get equipamento(): string {
    return this.detalhes?.equipamento ?? this.solicitacao?.descricaoEquipamento ?? '-';
  }

  get categoria(): string {
    return this.detalhes?.categoria ?? this.solicitacao?.categoria ?? '-';
  }

  get defeito(): string {
    return this.detalhes?.defeito ?? this.solicitacao?.descricaoDefeito ?? '-';
  }

  get motivoRejeicao(): string | undefined {
    return this.detalhes?.motivoRejeicao ?? this.solicitacao?.motivoRejeicao;
  }

  get status(): string {
    return this.detalhes?.status ?? this.solicitacao?.estado ?? '';
  }

  get statusNormalizado(): string {
    return this.normalizarStatus(this.status);
  }

  get dataCriacao(): Date | undefined {
    return this.converterData(this.detalhes?.dataCriacao ?? this.solicitacao?.dataHora);
  }

  get dataPagamento(): Date | undefined {
    return this.converterData(this.detalhes?.dataPagamento ?? this.solicitacao?.dataPagamento);
  }

  get dataFinalizacao(): Date | undefined {
    return this.converterData(this.detalhes?.dataFinalizacao ?? this.solicitacao?.dataFinalizacao);
  }

  get valorOrcamento(): number | undefined {
    return this.detalhes?.orcamento?.valor ?? this.solicitacao?.valorOrcamento;
  }

  get dataOrcamento(): Date | undefined {
    return this.converterData(this.detalhes?.orcamento?.dataOrcamento ?? this.solicitacao?.dataOrcamento);
  }

  get funcionarioOrcamento(): string | undefined {
    return this.detalhes?.orcamento?.funcionario ?? this.solicitacao?.funcionarioOrcamento;
  }

  get manutencaoDescricao(): string | undefined {
    return this.detalhes?.manutencao?.descricao ?? this.solicitacao?.descricaoManutencao;
  }

  get manutencaoOrientacao(): string | undefined {
    return this.detalhes?.manutencao?.orientacao ?? this.solicitacao?.orientacoesCliente;
  }

  get dataManutencao(): Date | undefined {
    return this.converterData(this.detalhes?.manutencao?.dataManutencao ?? this.solicitacao?.dataManutencao);
  }

  get funcionarioManutencao(): string | undefined {
    return this.detalhes?.manutencao?.funcionario ?? this.solicitacao?.funcionarioManutencao;
  }

  get temOrcamento(): boolean {
    return this.valorOrcamento !== undefined && this.valorOrcamento !== null;
  }

  get temManutencao(): boolean {
    return !!this.manutencaoDescricao || !!this.manutencaoOrientacao;
  }

  getStatusClass(estado: string): string {
    const map: Record<string, string> = {
      ABERTA: 's-aberta',
      ORCADA: 's-orcada',
      REJEITADA: 's-rejeitada',
      APROVADA: 's-aprovada',
      REDIRECIONADA: 's-redirecionada',
      ARRUMADA: 's-arrumada',
      PAGA: 's-paga',
      FINALIZADA: 's-finalizada',
    };

    return map[this.normalizarStatus(estado)] ?? '';
  }

  voltar(): void {
    this.fechar.emit();
  }

  acaoCliente(acao: AcaoCliente): void {
    this.acao.emit(acao);
  }

  private carregarDetalhes(): void {
    const id = this.idSolicitacao || this.solicitacao?.id;

    if (!id) {
      this.erroCarregamento = 'Solicitacao sem ID para buscar detalhes.';
      this.loading = false;
      this.cdr.detectChanges();
      return;
    }

    if (this.idCarregado === id) {
      return;
    }

    this.idCarregado = id;
    this.erroCarregamento = '';
    this.loading = true;
    this.cdr.detectChanges();

    this.solicitacaoService.buscarInformacoesCliente(id).subscribe({
      next: (detalhes) => {
        this.detalhes = detalhes;
        this.aplicarDetalhes(detalhes);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (erro) => {
        console.error('Erro ao buscar detalhes da solicitacao:', erro);
        this.erroCarregamento = 'Nao foi possivel carregar os detalhes completos da solicitacao.';
        this.loading = false;
        this.cdr.detectChanges();
      },
    });
  }

  private aplicarDetalhes(detalhes: InformacoesSolicitacaoDTO): void {
    this.solicitacao = {
      ...this.solicitacao,
      id: detalhes.id,
      descricaoEquipamento: detalhes.equipamento,
      categoria: detalhes.categoria,
      descricaoDefeito: detalhes.defeito,
      motivoRejeicao: detalhes.motivoRejeicao,
      estado: detalhes.status,
      dataHora: this.converterData(detalhes.dataCriacao),
      valorOrcamento: detalhes.orcamento?.valor,
      funcionarioOrcamento: detalhes.orcamento?.funcionario,
      dataOrcamento: this.converterData(detalhes.orcamento?.dataOrcamento),
      dataPagamento: this.converterData(detalhes.dataPagamento),
      dataFinalizacao: this.converterData(detalhes.dataFinalizacao),
      descricaoManutencao: detalhes.manutencao?.descricao,
      orientacoesCliente: detalhes.manutencao?.orientacao,
      funcionarioManutencao: detalhes.manutencao?.funcionario,
      dataManutencao: this.converterData(detalhes.manutencao?.dataManutencao),
    };

    this.historico = this.normalizarHistorico(detalhes.historico);
  }

  private normalizarHistorico(historico: any[]): Array<{ status: string; data: Date; funcionario?: string; observacao?: string }> {
    return historico.map(item => ({
      status: item.status ?? item.estado ?? '',
      data: this.converterData(item.data) ?? new Date(),
      funcionario: item.funcionario,
      observacao: item.observacao,
    }));
  }

  private converterData(data?: string | Date | null): Date | undefined {
    if (!data) {
      return undefined;
    }

    return data instanceof Date ? data : new Date(data);
  }

  private normalizarStatus(status: string): string {
    return status
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .toUpperCase();
  }
}
