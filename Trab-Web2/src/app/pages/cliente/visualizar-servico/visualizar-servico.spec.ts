import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';

// ─── Interfaces ────────────────────────────────────────────────────────────────

export interface Cliente {
  nome: string;
  email: string;
  cpf: string;
  telefone: string;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  estado: string;
  cep: string;
}

export interface HistoricoItem {
  estadoAnterior: string | null;
  estadoNovo: string;
  descricao?: string;
  responsavel: string;
  dataHora: string | Date;
}

export interface Solicitacao {
  id: number;
  estado: EstadoSolicitacao;

  // Equipamento
  descricaoEquipamento: string;
  categoria: string;
  descricaoDefeito: string;
  dataHora: string | Date;

  // Orçamento (opcional)
  valorOrcamento?: number;
  funcionarioOrcamento?: string;
  dataOrcamento?: string | Date;

  // Manutenção (opcional)
  descricaoManutencao?: string;
  orientacoesCliente?: string;
  funcionarioManutencao?: string;
  dataManutencao?: string | Date;

  // Relações
  cliente: Cliente;
}

export type EstadoSolicitacao =
  | 'ABERTA'
  | 'ORÇADA'
  | 'REJEITADA'
  | 'APROVADA'
  | 'REDIRECIONADA'
  | 'ARRUMADA'
  | 'PAGA'
  | 'FINALIZADA';

export type PerfilUsuario = 'CLIENTE' | 'FUNCIONARIO' | 'ADMIN';

// ─── Mapa de estado → classe CSS ───────────────────────────────────────────────

const STATUS_CLASS_MAP: Record<string, string> = {
  ABERTA:         'status-aberta',
  ORÇADA:         'status-orcada',
  REJEITADA:      'status-rejeitada',
  APROVADA:       'status-aprovada',
  REDIRECIONADA:  'status-redirecionada',
  ARRUMADA:       'status-arrumada',
  PAGA:           'status-paga',
  FINALIZADA:     'status-finalizada',
};

// ─── Componente ────────────────────────────────────────────────────────────────

@Component({
  selector: 'app-visualizar-servico',
  standalone: true,
  imports: [CommonModule, CurrencyPipe, DatePipe],
  templateUrl: './visualizar-servico.html',
  styleUrl: './visualizar-servico.css',
})
export class VisualizarServico implements OnInit {

  // ── Injeções ────────────────────────────────────────────────────────────────
  private readonly route  = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly http   = inject(HttpClient);

  // ── Signals de estado ───────────────────────────────────────────────────────
  readonly loading     = signal(true);
  readonly solicitacao = signal<Solicitacao | null>(null);
  readonly historico   = signal<HistoricoItem[]>([]);

  /**
   * Perfil do usuário logado.
   *
   * Substitua pela leitura do seu AuthService/TokenService, por exemplo:
   *   private auth = inject(AuthService);
   *   readonly perfil = computed(() => this.auth.perfil());
   */
  readonly perfil = signal<PerfilUsuario>('CLIENTE');

  // ── Signals derivados (computed) ────────────────────────────────────────────

  /** Estado atual da solicitação em uppercase, para comparações no template. */
  readonly estadoAtual = computed(() => this.solicitacao()?.estado ?? '');

  /** Número de itens no histórico — exibido no badge. */
  readonly totalHistorico = computed(() => this.historico().length);

  // ── Ciclo de vida ───────────────────────────────────────────────────────────

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id || isNaN(Number(id))) {
      this.loading.set(false);
      return;
    }

    this.carregarSolicitacao(Number(id));
  }

  // ── Carregamento de dados ───────────────────────────────────────────────────

  private carregarSolicitacao(id: number): void {
    this.loading.set(true);

    // Substitua a URL base pela sua constante de ambiente (environment.apiUrl)
    this.http.get<Solicitacao>(`/api/solicitacoes/${id}`).subscribe({
      next: (data) => {
        this.solicitacao.set(data);
        this.carregarHistorico(id);
      },
      error: () => {
        this.solicitacao.set(null);
        this.loading.set(false);
      },
    });
  }

  private carregarHistorico(id: number): void {
    this.http.get<HistoricoItem[]>(`/api/solicitacoes/${id}/historico`).subscribe({
      next: (data) => {
        this.historico.set(data);
        this.loading.set(false);
      },
      error: () => {
        // Histórico é opcional — falha silenciosa
        this.historico.set([]);
        this.loading.set(false);
      },
    });
  }

  // ── Helpers de template ─────────────────────────────────────────────────────

  /** Retorna a classe CSS correspondente ao estado informado. */
  getStatusClass(estado: string | null | undefined): string {
    if (!estado) return '';
    return STATUS_CLASS_MAP[estado.toUpperCase()] ?? '';
  }

  /** Gera as iniciais (até 2) do nome para o avatar do cliente. */
  getInitials(nome: string): string {
    if (!nome?.trim()) return '?';

    return nome
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((w) => w[0].toUpperCase())
      .join('');
  }

  // ── Ações — navegação ───────────────────────────────────────────────────────

  voltar(): void {
    this.router.navigate(['/solicitacoes']);
  }

  /**
   * CLIENTE + estado ORÇADA  → tela de aprovação / rejeição do orçamento.
   * FUNCIONARIO + estado ABERTA → tela de criação de orçamento.
   */
  irParaOrcamento(): void {
    const s = this.solicitacao();
    if (!s) return;
    this.router.navigate(['/solicitacoes', s.id, 'orcamento']);
  }

  /** CLIENTE + estado ARRUMADA → tela de pagamento. */
  irParaPagamento(): void {
    const s = this.solicitacao();
    if (!s) return;
    this.router.navigate(['/solicitacoes', s.id, 'pagamento']);
  }

  /** FUNCIONARIO + estado APROVADA | REDIRECIONADA → tela de manutenção. */
  irParaManutencao(): void {
    const s = this.solicitacao();
    if (!s) return;
    this.router.navigate(['/solicitacoes', s.id, 'manutencao']);
  }

  // ── Ações — chamadas à API ──────────────────────────────────────────────────

  /** CLIENTE + estado REJEITADA → reabre a solicitação. */
  resgatarServico(): void {
    const s = this.solicitacao();
    if (!s) return;

    this.http.patch<Solicitacao>(`/api/solicitacoes/${s.id}/resgatar`, {}).subscribe({
      next: (atualizada) => this.solicitacao.set(atualizada),
      error: (err) => console.error('Erro ao resgatar serviço:', err),
    });
  }

  /** FUNCIONARIO + estado PAGA → marca a solicitação como FINALIZADA. */
  finalizarSolicitacao(): void {
    const s = this.solicitacao();
    if (!s) return;

    this.http.patch<Solicitacao>(`/api/solicitacoes/${s.id}/finalizar`, {}).subscribe({
      next: (atualizada) => {
        this.solicitacao.set(atualizada);
        this.carregarHistorico(atualizada.id); // Atualiza o histórico após a mudança
      },
      error: (err) => console.error('Erro ao finalizar solicitação:', err),
    });
  }
}