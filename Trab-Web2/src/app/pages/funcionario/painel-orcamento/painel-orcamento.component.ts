import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../../services/solicitacao.service';

@Component({
  selector: 'app-painel-orcamento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './painel-orcamento.component.html',
  styleUrls: ['./painel-orcamento.component.css']
})
export class PainelOrcamentoComponent implements OnInit {

  private solicitacaoService = inject(SolicitacaoService);

  dataInicio: string = '';
  dataFim: string = '';
  dataAtual: string = '';
  gerandoRelatorioPeriodo = false;
  gerandoRelatorioCategoria = false;

  ngOnInit(): void {
    this.dataAtual = new Date().toISOString().split('T')[0];
  }

  gerarRelatorioPeriodo(): void {
    if (this.dataInicio && this.dataFim && this.dataInicio > this.dataFim) {
      alert('A data inicial nao pode ser maior que a data final.');
      return;
    }

    this.gerandoRelatorioPeriodo = true;

    this.solicitacaoService.gerarRelatorioReceitas(this.dataInicio, this.dataFim).subscribe({
      next: (pdf: Blob) => {
        this.baixarPdf(pdf, 'relatorio-receitas.pdf');
        this.gerandoRelatorioPeriodo = false;
      },
      error: (err) => {
        console.error('Erro de comunicacao com a API:', err);
        alert('Nao foi possivel gerar o relatorio. Verifique a conexao.');
        this.gerandoRelatorioPeriodo = false;
      }
    });
  }

  gerarRelatorioCategoria(): void {
    this.gerandoRelatorioCategoria = true;

    this.solicitacaoService.gerarRelatorioReceitasPorCategoria().subscribe({
      next: (pdf: Blob) => {
        this.baixarPdf(pdf, 'relatorio-receitas-categorias.pdf');
        this.gerandoRelatorioCategoria = false;
      },
      error: (err) => {
        console.error('Erro de comunicacao com a API de relatorios:', err);
        alert('Nao foi possivel gerar o relatorio. Verifique a conexao.');
        this.gerandoRelatorioCategoria = false;
      }
    });
  }

  private baixarPdf(pdf: Blob, nomeArquivo: string): void {
    const url = URL.createObjectURL(pdf);
    const link = document.createElement('a');

    link.href = url;
    link.download = nomeArquivo;
    link.click();

    URL.revokeObjectURL(url);
  }
}
