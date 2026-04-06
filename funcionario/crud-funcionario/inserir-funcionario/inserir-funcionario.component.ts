import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { Funcionario } from '../../../../shared/models/funcionario.model';
import { FormsModule, NgForm } from '@angular/forms';
import { FuncionarioService } from '../../../../services/funcionario.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-inserir-funcionario',
  imports: [RouterModule, CommonModule, FormsModule],
  templateUrl: './inserir-funcionario.component.html',
  styleUrl: './inserir-funcionario.component.css',
})
export class InserirFuncionarioComponent {
  @ViewChild('formFuncionario') formulario! : NgForm;
  funcionario: Funcionario = new Funcionario();
  
  private funcionarioService = inject(FuncionarioService)
  private router = inject(Router)
email: any;
nasc: any;

  inserir(): void {
    if (this.formulario.form.valid) {
      if (typeof this.funcionario.nasc === 'string') {
        
        this.funcionario.nasc = new Date(this.funcionario.nasc);
      }
      this.funcionarioService.inserir(this.funcionario);
      this.router.navigate(["/funcionario/users"]);
    }
  }
}
