import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-visualizar-servico',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visualizar-servico.html',
  styleUrl: './visualizar-servico.css',
})
export class VisualizarServico implements OnInit {

  loading = true;
  perfil = 'FUNCIONARIO'; // troque para 'CLIENTE' para testar
  solicitacao: any = null;
  historico: any[] = [];

  constructor(private router: Router) {}

  ngOnInit() {
    setTimeout(() => {
      this.solicitacao = {
        id: 1042,
        estado: 'ABERTA',
        descricaoEquipamento: 'Notebook Dell Inspiron 15',
        categoria: 'Informática',
        descricaoDefeito: 'Não liga após queda. Bateria indica carga, tela permanece apagada e sem sinal de boot.',
        dataHora: new Date('2025-03-10T09:30:00'),
        cliente: {
          nome: 'Maria Fernanda Oliveira',
          email: 'maria.fernanda@email.com',
          cpf: '123.456.789-00',
          telefone: '(41) 99876-5432',
          logradouro: 'Rua das Flores',
          numero: '342',
          complemento: 'Apto 12',
          bairro: 'Água Verde',
          cidade: 'Curitiba',
          estado: 'PR',
          cep: '80610-010',
        },
      };
      this.historico = [{
        estadoAnterior: null,
        estadoNovo: 'ABERTA',
        descricao: 'Solicitação criada pelo cliente.',
        responsavel: 'Maria Fernanda Oliveira',
        dataHora: new Date('2025-03-10T09:30:00'),
      }];
      this.loading = false;
    }, 600);
  }

  getStatusClass(estado: string) {
    const map: any = {
      'ABERTA': 's-aberta', 'ORÇADA': 's-orcada', 'REJEITADA': 's-rejeitada',
      'APROVADA': 's-aprovada', 'REDIRECIONADA': 's-redirecionada',
      'ARRUMADA': 's-arrumada', 'PAGA': 's-paga', 'FINALIZADA': 's-finalizada',
    };
    return map[estado] ?? '';
  }

  getInitials(nome: string) {
    return nome.trim().split(/\s+/).slice(0, 2).map(w => w[0].toUpperCase()).join('');
  }

  voltar() {
    this.router.navigate(['/solicitacoes']);
  }

  private mudar(novoEstado: string, descricao: string, responsavel?: string) {
    const anterior = this.solicitacao.estado;
    this.solicitacao = { ...this.solicitacao, estado: novoEstado };
    this.historico = [{
      estadoAnterior: anterior,
      estadoNovo: novoEstado,
      descricao,
      responsavel: responsavel ?? 'Sistema',
      dataHora: new Date(),
    }, ...this.historico];
  }

  // Ações do FUNCIONARIO
  efetuarOrcamento() {
    this.solicitacao = { ...this.solicitacao, valorOrcamento: 350, funcionarioOrcamento: 'Carlos Técnico', dataOrcamento: new Date() };
    this.mudar('ORÇADA', 'Orçamento realizado.', 'Carlos Técnico');
  }

  efetuarManutencao() {
    this.solicitacao = {
      ...this.solicitacao,
      descricaoManutencao: 'Substituição da placa de vídeo e limpeza interna.',
      orientacoesCliente: 'Evitar quedas. Retornar em caso de reincidência.',
      funcionarioManutencao: 'Carlos Técnico',
      dataManutencao: new Date(),
    };
    this.mudar('ARRUMADA', 'Manutenção concluída.', 'Carlos Técnico');
  }

  finalizarSolicitacao() {
    this.mudar('FINALIZADA', 'Solicitação finalizada.', 'Carlos Técnico');
  }

  // Ações do CLIENTE
  aprovarOrcamento() {
    this.mudar('APROVADA', 'Orçamento aprovado pelo cliente.', this.solicitacao.cliente.nome);
  }

  rejeitarOrcamento() {
    this.mudar('REJEITADA', 'Orçamento rejeitado pelo cliente.', this.solicitacao.cliente.nome);
  }

  resgatarServico() {
    this.mudar('ABERTA', 'Solicitação resgatada pelo cliente.', this.solicitacao.cliente.nome);
  }

  pagar() {
    this.mudar('PAGA', 'Pagamento realizado.', this.solicitacao.cliente.nome);
  }
}