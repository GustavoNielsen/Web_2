import { Component, inject, OnInit } from '@angular/core';
import { FuncionarioService } from '../../../../services/funcionario.service';
import { Funcionario } from '../../../../shared/models/funcionario.model';

@Component({
  selector: 'app-listar-funcionario',
  imports: [],
  templateUrl: './listar-funcionario.component.html',
  styleUrl: './listar-funcionario.component.css',
})
export class ListarFuncionarioComponent implements OnInit {
  private funcionarioService = inject(FuncionarioService);
  funcionarios: Funcionario[] = [];

  ngOnInit(): void {
    // this.funcionarios = this.funcionarioService.listarTodos();
    this.funcionarios = [
      new Funcionario(1, 'Gustavo', 'gustavo@gmail.com', new Date('2004-03-16'))
    ];
  }
}

