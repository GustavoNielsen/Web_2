import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-visualizar-solicitacao',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './visualizar-solicitacao.html',
  styleUrl: './visualizar-solicitacao.css'
})
export class VisualizarSolicitacao {
  @Input() solicitacao: any;
  @Output() fechar = new EventEmitter<void>();

  // Reutilizando sua escala de cores oficial do RF013
  getStatusClass(status: string): string {
    switch (status) {
      case 'ABERTA': return 'bg-secondary text-white';
      case 'ORÇADA': return 'bg-brown text-white';
      case 'REJEITADA': return 'bg-danger text-white';
      case 'APROVADA': return 'bg-warning text-dark';
      case 'REDIRECIONADA': return 'bg-purple text-white';
      case 'ARRUMADA': return 'bg-primary text-white';
      case 'PAGA': return 'bg-orange text-white';
      case 'FINALIZADA': return 'bg-success text-white';
      default: return 'bg-dark text-white';
    }
  }
  
}