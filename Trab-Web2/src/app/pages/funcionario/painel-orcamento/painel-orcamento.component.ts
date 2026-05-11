import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { STATUS_SOLICITACAO } from '../../../shared/constants/status.constants';
import { StatusFormatPipe } from '../../../shared/pipes/status-format.pipe';


// Gerador de PDF
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

@Component({
  selector: 'app-painel-orcamento',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule, StatusFormatPipe],
  templateUrl: './painel-orcamento.component.html',
  styleUrls: ['./painel-orcamento.component.css']
})

export class PainelOrcamentoComponent implements OnInit {
  // Novo objeto que controlará todo o formulário
  orcamentoForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  // --- Variáveis dos Relatórios ---
  dataInicio: string = '';
  dataFim: string = '';
  dataAtual: string = '';

  ngOnInit(): void {
    this.dataAtual = new Date().toISOString().split('T')[0];

    //Inicializando o formulário com as regras de validação
    this.orcamentoForm = this.fb.group({
      numeroSolicitacao: [null, [
        Validators.required, 
        Validators.min(1),
        Validators.pattern("^[0-9]*$") //só numeros inteiros
      ]],
      valorOrcamento: [null, [
        Validators.required, 
        Validators.min(0.01) //Valor tem que ser maior que zero
      ]]
    });
  }

  impedirNegativo(event: KeyboardEvent): void {
    if (event.key === '-' || event.key === 'e' || event.key === 'E') {
      event.preventDefault();
    }
  }

  confirmarOrcamento(): void { 
    if (this.orcamentoForm.invalid) {
      this.orcamentoForm.markAllAsTouched();
      return;
    }

    const { numeroSolicitacao, valorOrcamento } = this.orcamentoForm.value;
    
    alert(`Sucesso! Orçamento de R$ ${valorOrcamento} registrado para a Solicitação #${numeroSolicitacao}.`);
    this.orcamentoForm.reset(); // Limpa o formulário após o sucesso
  }






  
  // --- Por Período ---
  gerarRelatorioPeriodo(): void {
    const doc = new jsPDF();
    
    // Título do Documento
    doc.setFontSize(16);
    doc.text('Relatório Financeiro - Receitas por Período', 14, 20);
    doc.setFontSize(10);
    doc.text(`Período: ${this.dataInicio || 'Início'} até ${this.dataFim || 'Hoje'}`, 14, 28);

    // Dados fictícios simulando o retorno do Banco de Dados - MUDAR DEPOIS 
    const dadosFicticios = [
      ['01/04/2026', 'Manutenção Notebook', 'R$ 250,00'],
      ['02/04/2026', 'Troca de Tela', 'R$ 600,00'],
      ['03/04/2026', 'Formatação', 'R$ 120,00'],
      ['05/04/2026', 'Limpeza Interna', 'R$ 150,00'],
    ];

    // Gerando a Tabela
    autoTable(doc, {
      startY: 35,
      head: [['Data', 'Serviço Agrupado', 'Valor Arrecadado']],
      body: dadosFicticios,
      theme: 'striped',
      headStyles: { fillColor: [13, 110, 253] } // Cor azul do Bootstrap
    });

    // Download do arquivo
    doc.save('relatorio-periodo.pdf');
  }

  // --- GERAÇÃO DE PDF: Por Categoria ---
  gerarRelatorioCategoria(): void {
    const doc = new jsPDF();
    
    // Título do Documento
    doc.setFontSize(16);
    doc.text('Relatório Financeiro - Receitas por Categoria', 14, 20);
    doc.setFontSize(10);
    doc.text('Histórico completo consolidado.', 14, 28);

    // Dados fictícios 
    const dadosFicticios = [
      ['Notebook', '15', 'R$ 3.500,00'],
      ['Desktop', '8', 'R$ 1.200,00'],
      ['Impressora', '5', 'R$ 450,00'],
      ['Mouse / Teclado', '12', 'R$ 360,00'],
    ];

    // Gera a Tabela
    autoTable(doc, {
      startY: 35,
      head: [['Categoria de Equipamento', 'Qtd. Serviços', 'Receita Total']],
      body: dadosFicticios,
      theme: 'striped',
      headStyles: { fillColor: [25, 135, 84] } // Cor verde do Bootstrap para diferenciar
    });

    // Faz o download do arquivo
    doc.save('relatorio-categorias.pdf');
  }
}
