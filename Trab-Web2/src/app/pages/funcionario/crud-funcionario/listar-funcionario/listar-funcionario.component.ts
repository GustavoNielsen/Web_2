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
    this.funcionarios = this.funcionarioService.listarTodos();
   
  }

  remover($event: any, funcionario: Funcionario): void {
    $event.preventDefault();
    if (confirm(`Deseja realmente remover o funcionário ${funcionario.nome}?`)) {
      this.funcionarioService.remover(funcionario.id!);
      this.funcionarios = this.funcionarioService.listarTodos();
    }
  }
}

