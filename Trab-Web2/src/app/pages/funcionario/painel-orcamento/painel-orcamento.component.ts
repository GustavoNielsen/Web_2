import { Component, OnInit, inject } from '@angular/core'; 
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { SolicitacaoService } from '../../../services/solicitacao.service';

// Gerador de PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-painel-orcamento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './painel-orcamento.component.html',
  styleUrls: ['./painel-orcamento.component.css']
})

export class PainelOrcamentoComponent implements OnInit {

  private solicitacaoService = inject(SolicitacaoService);

  // --- Variáveis dos Relatórios ---
  dataInicio: string = '';
  dataFim: string = '';
  dataAtual: string = '';

  ngOnInit(): void {
    this.dataAtual = new Date().toISOString().split('T')[0];
  }

  // --- Por Período ---
  gerarRelatorioPeriodo(): void {
    if (!this.dataInicio || !this.dataFim) {
      alert('Selecione o período inicial e final.');
      return;
    }

    this.solicitacaoService.solicitacoesPorPeriodo(this.dataInicio, this.dataFim).subscribe({
      next: (dados: any[]) => {
        const doc = new jsPDF();
        
        // Título do Documento
        doc.setFontSize(16);
        doc.text('Relatório Financeiro - Receitas por Período', 14, 20);
        doc.setFontSize(10);
        doc.text(`Período: ${this.dataInicio} até ${this.dataFim}`, 14, 28);

        //mapeia os dados devolvidos
        const linhasTabela = dados.map(item => [
          item.dataHora ? new Date(item.dataHora).toLocaleDateString('pt-BR') : '-', 
          item.descricaoEquipamento, 
          item.estado
        ]);

        // Gerando a Tabela
        autoTable(doc, {
          startY: 35,
          head: [['Data', 'Equipamento', 'Estado']],
          body: linhasTabela,
          theme: 'striped',
          headStyles: { fillColor: [13, 110, 253] } // Cor azul do Bootstrap
        });

        // Download do arquivo
        doc.save('relatorio-periodo.pdf');
      },
      error: (err) => {
        console.error('Erro de comunicação com a API:', err);
        alert('Não foi possível gerar o relatório. Verifique a conexão.');
      }
    });
  }

  // --- Por Categoria ---
  gerarRelatorioCategoria(): void {
    this.solicitacaoService.obterRelatorioCategoria().subscribe({
      next: (dados: any[]) => {
        const doc = new jsPDF();
        
        // Título do Documento
        doc.setFontSize(16);
        doc.text('Relatório Financeiro - Receitas por Categoria', 14, 20);
        doc.setFontSize(10);
        doc.text('Histórico completo consolidado.', 14, 28);

        const linhasTabela = dados.map(item => [
          item.categoria || '-', 
          item.quantidadeServicos?.toString() || '0', 
          item.receitaTotal ? `R$ ${item.receitaTotal}` : 'R$ 0,00'
        ]);

        // Gera a Tabela
        autoTable(doc, {
          startY: 35,
          head: [['Categoria de Equipamento', 'Qtd. Serviços', 'Receita Total']],
          body: linhasTabela,
          theme: 'striped',
          headStyles: { fillColor: [25, 135, 84] } // Cor verde do Bootstrap
        });

        //download do arquivo
        doc.save('relatorio-categorias.pdf');
      },
      error: (err) => {
        console.error('Erro de comunicação com a API de Relatórios:', err);
        alert('Não foi possível gerar o relatório. Verifique a conexão.');
      }
    });
  }
}