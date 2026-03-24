import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-pag-funcionario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pag-funcionario.html',
  styleUrl: './pag-funcionario.css',
})
export class PagFuncionario {

  nomeUsuario = 'Usuário';
  filtro: 'HOJE' | 'TODAS' | 'PERIODO' = 'HOJE';

  dataInicio: string = '';
  dataFim: string = '';

  loading = false;

  solicitacoesFiltradas: any[] = [];


  setFiltro(f: 'HOJE' | 'TODAS' | 'PERIODO') {
    this.filtro = f;
  }

  aplicarFiltro() {}

  getStatusClass(status: string): string {
    return '';
  }

  visualizar(id: number) {}

  efetuarOrcamento(id: number) {}

  efetuarManutencao(id: number) {}

  finalizar(id: number) {}
}