import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { STATUS_SOLICITACAO } from '../../../shared/constants/status.constants';
import { StatusFormatPipe } from '../../../shared/pipes/status-format.pipe';

@Component({
  selector: 'app-visualizar-solicitacao',
  standalone: true,
  imports: [CommonModule, StatusFormatPipe],
  templateUrl: './visualizar-solicitacao.html',
  styleUrl: './visualizar-solicitacao.css'
})
export class VisualizarSolicitacao {
  @Input() solicitacao: any;
  @Output() fechar = new EventEmitter<void>();

  // Reutilizando sua escala de cores oficial do RF013
  getStatusClass(status: string): string {
    switch (status) {
      case STATUS_SOLICITACAO.ABERTA: return 'bg-secondary text-white';
      case STATUS_SOLICITACAO.ORCADA: return 'bg-brown text-white';
      case STATUS_SOLICITACAO.REJEITADA: return 'bg-danger text-white';
      case STATUS_SOLICITACAO.APROVADA: return 'bg-warning text-dark';
      case STATUS_SOLICITACAO.REDIRECIONADA: return 'bg-purple text-white';
      case STATUS_SOLICITACAO.ARRUMADA: return 'bg-primary text-white';
      case STATUS_SOLICITACAO.PAGA: return 'bg-orange text-white';
      case STATUS_SOLICITACAO.FINALIZADA: return 'bg-success text-white';
      default: return 'bg-dark text-white';
    }
  }
  
}