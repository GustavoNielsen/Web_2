import { Component, inject, OnInit } from '@angular/core';
import { FuncionarioService } from '../../../../services/funcionario.service';
import { Funcionario } from '../../../../shared/models/funcionario.model';
import { CommonModule } from '@angular/common';
import { RouterLink } from "@angular/router";

@Component({
  selector: 'app-listar-funcionario',
  imports: [CommonModule, RouterLink],
  templateUrl: './listar-funcionario.component.html',
  styleUrl: './listar-funcionario.component.css',
})
export class ListarFuncionarioComponent implements OnInit {
  private funcionarioService = inject(FuncionarioService);
  funcionarios: Funcionario[] = [];

  ngOnInit(): void {
    this.carregarFuncionarios();
   
  }

  carregarFuncionarios(): void {
    this.funcionarioService.listarTodos().subscribe({
      next: (data) => this.funcionarios = data,
      error: (err) => console.error('Erro ao listar funcionários:', err)
    });
  }

  remover($event: any, funcionario: Funcionario): void {
    $event.preventDefault();
    if (confirm(`Deseja realmente remover o funcionário ${funcionario.nome}?`)) {
      //o angular manda o DELETE e espera o sucesso para recarregar a tabela
      this.funcionarioService.remover(funcionario.id!).subscribe({
        next: () => this.carregarFuncionarios(),
        error: (err) => console.error('Erro ao remover funcionário:', err)
      });
    }
  }

}

